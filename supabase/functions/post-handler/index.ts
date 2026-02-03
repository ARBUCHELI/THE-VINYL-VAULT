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
      case 'create-post': {
        const { title, slug, content, excerpt, cover_image, author_id, category_id, status } = data
        const { data: post, error } = await supabaseClient
          .from('posts')
          .insert({
            title,
            slug,
            content,
            excerpt,
            cover_image,
            author_id,
            category_id,
            status,
            published_at: status === 'published' ? new Date().toISOString() : null
          })
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: post }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-post': {
        const { postId, updates } = data
        const { data: post, error } = await supabaseClient
          .from('posts')
          .update(updates)
          .eq('id', postId)
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: post }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete-post': {
        const { postId } = data
        const { error } = await supabaseClient
          .from('posts')
          .delete()
          .eq('id', postId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-post': {
        const { postId } = data
        const { data: post, error } = await supabaseClient
          .from('posts')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url),
            categories:category_id(name, slug),
            post_tags(tags(*))
          `)
          .eq('id', postId)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: post }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-post-by-slug': {
        const { slug } = data
        const { data: post, error } = await supabaseClient
          .from('posts')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url, bio),
            categories:category_id(name, slug),
            post_tags(tags(*))
          `)
          .eq('slug', slug)
          .single()
        
        if (error) throw error
        
        // Increment view count
        await supabaseClient.rpc('increment_post_views', { post_id: post.id })
        
        return new Response(
          JSON.stringify({ success: true, data: post }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-all-posts': {
        const { limit, offset, status, authorId, categoryId } = data
        
        let query = supabaseClient
          .from('posts')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url),
            categories:category_id(name, slug)
          `, { count: 'exact' })
        
        if (status) {
          query = query.eq('status', status)
        }
        if (authorId) {
          query = query.eq('author_id', authorId)
        }
        if (categoryId) {
          query = query.eq('category_id', categoryId)
        }
        
        query = query
          .order('created_at', { ascending: false })
          .range(offset || 0, (offset || 0) + (limit || 9))
        
        const { data: posts, error, count } = await query
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: posts, count }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-published-posts': {
        const { limit, offset } = data
        const { data: posts, error, count } = await supabaseClient
          .from('posts')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url),
            categories:category_id(name, slug)
          `, { count: 'exact' })
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .range(offset || 0, (offset || 0) + (limit || 9))
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: posts, count }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'search-posts': {
        const { query, limit, offset } = data
        const { data: posts, error, count } = await supabaseClient
          .from('posts')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url),
            categories:category_id(name, slug)
          `, { count: 'exact' })
          .eq('status', 'published')
          .or(`title.ilike.%${query}%,content.ilike.%${query}%,excerpt.ilike.%${query}%`)
          .order('published_at', { ascending: false })
          .range(offset || 0, (offset || 0) + (limit || 9))
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: posts, count }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-user-posts': {
        const { userId, limit, offset } = data
        const { data: posts, error, count } = await supabaseClient
          .from('posts')
          .select(`
            *,
            categories:category_id(name, slug)
          `, { count: 'exact' })
          .eq('author_id', userId)
          .order('created_at', { ascending: false })
          .range(offset || 0, (offset || 0) + (limit || 9))
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: posts, count }),
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
