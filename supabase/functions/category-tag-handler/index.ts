import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { action, data } = await req.json()

    switch (action) {
      // CATEGORIES
      case 'create-category': {
        const { name, slug, description } = data
        const { data: category, error } = await supabaseClient
          .from('categories')
          .insert({ name, slug, description })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: category }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-category': {
        const { categoryId, updates } = data
        const { data: category, error } = await supabaseClient
          .from('categories')
          .update(updates)
          .eq('id', categoryId)
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: category }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete-category': {
        const { categoryId } = data
        const { error } = await supabaseClient
          .from('categories')
          .delete()
          .eq('id', categoryId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-all-categories': {
        const { data: categories, error } = await supabaseClient
          .from('categories')
          .select('*')
          .order('name')
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: categories }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-category': {
        const { categoryId } = data
        const { data: category, error } = await supabaseClient
          .from('categories')
          .select('*')
          .eq('id', categoryId)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: category }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-category-by-slug': {
        const { slug } = data
        const { data: category, error } = await supabaseClient
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: category }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // TAGS
      case 'create-tag': {
        const { name, slug } = data
        const { data: tag, error } = await supabaseClient
          .from('tags')
          .insert({ name, slug })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: tag }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-all-tags': {
        const { data: tags, error } = await supabaseClient
          .from('tags')
          .select('*')
          .order('name')
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: tags }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-tag': {
        const { tagId } = data
        const { data: tag, error } = await supabaseClient
          .from('tags')
          .select('*')
          .eq('id', tagId)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: tag }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // POST TAGS (Junction)
      case 'add-post-tag': {
        const { postId, tagId } = data
        const { data: postTag, error } = await supabaseClient
          .from('post_tags')
          .insert({ post_id: postId, tag_id: tagId })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: postTag }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'remove-post-tag': {
        const { postId, tagId } = data
        const { error } = await supabaseClient
          .from('post_tags')
          .delete()
          .eq('post_id', postId)
          .eq('tag_id', tagId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-post-tags': {
        const { postId } = data
        const { data: postTags, error } = await supabaseClient
          .from('post_tags')
          .select(`
            *,
            tags(*)
          `)
          .eq('post_id', postId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: postTags }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-post-tags': {
        const { postId, tagIds } = data
        
        // First, remove all existing tags for this post
        await supabaseClient
          .from('post_tags')
          .delete()
          .eq('post_id', postId)
        
        // Then add the new tags
        if (tagIds && tagIds.length > 0) {
          const postTagsToInsert = tagIds.map((tagId: string) => ({
            post_id: postId,
            tag_id: tagId
          }))
          
          const { data: postTags, error } = await supabaseClient
            .from('post_tags')
            .insert(postTagsToInsert)
            .select()
          
          if (error) throw error
          
          return new Response(
            JSON.stringify({ success: true, data: postTags }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        
        return new Response(
          JSON.stringify({ success: true, data: [] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
