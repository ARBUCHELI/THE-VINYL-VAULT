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
      case 'create-comment': {
        const { post_id, author_id, content, parent_id } = data
        const { data: comment, error } = await supabaseClient
          .from('comments')
          .insert({
            post_id,
            author_id,
            content,
            parent_id: parent_id || null
          })
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url)
          `)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: comment }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-comment': {
        const { commentId, content } = data
        const { data: comment, error } = await supabaseClient
          .from('comments')
          .update({ content })
          .eq('id', commentId)
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url)
          `)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: comment }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete-comment': {
        const { commentId } = data
        const { error } = await supabaseClient
          .from('comments')
          .delete()
          .eq('id', commentId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-post-comments': {
        const { postId } = data
        const { data: comments, error } = await supabaseClient
          .from('comments')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url)
          `)
          .eq('post_id', postId)
          .is('parent_id', null)
          .order('created_at', { ascending: true })
        
        if (error) throw error
        
        // Fetch replies for each comment
        const commentsWithReplies = await Promise.all(
          comments.map(async (comment) => {
            const { data: replies } = await supabaseClient
              .from('comments')
              .select(`
                *,
                profiles:author_id(username, full_name, avatar_url)
              `)
              .eq('parent_id', comment.id)
              .order('created_at', { ascending: true })
            
            return { ...comment, replies: replies || [] }
          })
        )
        
        return new Response(
          JSON.stringify({ success: true, data: commentsWithReplies }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-comment': {
        const { commentId } = data
        const { data: comment, error } = await supabaseClient
          .from('comments')
          .select(`
            *,
            profiles:author_id(username, full_name, avatar_url)
          `)
          .eq('id', commentId)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: comment }),
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
