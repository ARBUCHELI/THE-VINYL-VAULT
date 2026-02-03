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
      case 'get-profile': {
        const { userId } = data
        const { data: profile, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: profile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-profile-by-username': {
        const { username } = data
        const { data: profile, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: profile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-profile': {
        const { userId, updates } = data
        const { data: profile, error } = await supabaseClient
          .from('profiles')
          .update(updates)
          .eq('id', userId)
          .select()
          .single()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: profile }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-user-roles': {
        const { userId } = data
        const { data: roles, error } = await supabaseClient
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: roles }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'get-all-profiles': {
        const { data: profiles, error } = await supabaseClient
          .from('profiles')
          .select(`
            *,
            user_roles(role)
          `)
          .order('created_at', { ascending: false })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: profiles }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-user-role': {
        const { userId, role } = data
        
        // First, delete existing roles for this user
        await supabaseClient
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
        
        // Then insert the new role
        const { data: newRole, error } = await supabaseClient
          .from('user_roles')
          .insert({ user_id: userId, role })
          .select()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: newRole }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'delete-profile': {
        const { userId } = data
        const { error } = await supabaseClient
          .from('profiles')
          .delete()
          .eq('id', userId)
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
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
