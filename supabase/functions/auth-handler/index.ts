import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
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
      case 'signup': {
        const { email, password, username, full_name } = data
        const { data: authData, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: {
            data: {
              username,
              full_name,
            }
          }
        })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: authData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'login': {
        const { email, password } = data
        const { data: authData, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password,
        })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: authData }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'logout': {
        const { error } = await supabaseClient.auth.signOut()
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'reset-password': {
        const { email } = data
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
          redirectTo: `${req.headers.get('origin')}/reset-password`,
        })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'update-password': {
        const { password } = data
        const { data: authData, error } = await supabaseClient.auth.updateUser({
          password,
        })
        
        if (error) throw error
        
        return new Response(
          JSON.stringify({ success: true, data: authData }),
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
