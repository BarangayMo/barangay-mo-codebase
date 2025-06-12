
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, firstName, lastName, role, welcomeMessage } = await req.json()

    const resend = new Resend(Deno.env.get('RESEND_API_KEY')!)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get the current user (who is sending the invitation)
    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabase
      .from('user_invitations')
      .insert({
        email,
        first_name: firstName,
        last_name: lastName,
        role,
        welcome_message: welcomeMessage,
        invited_by: user.id,
        status: 'pending',
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      })
      .select()
      .single()

    if (invitationError) {
      throw invitationError
    }

    // Send invitation email
    const inviteLink = `${supabaseUrl}/register?invitation=${invitation.id}`
    
    const { error: emailError } = await resend.emails.send({
      from: 'Barangay Mo <noreply@barangaymo.com>',
      to: [email],
      subject: `You're invited to join Barangay Mo as ${role}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Barangay Mo!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: white;">
            <h2 style="color: #1F2937; margin-bottom: 20px;">Hi ${firstName || 'there'}!</h2>
            
            <p style="color: #4B5563; line-height: 1.6; margin-bottom: 20px;">
              You've been invited to join Barangay Mo as a <strong>${role}</strong>. 
              ${welcomeMessage ? `Here's a personal message from your inviter: "${welcomeMessage}"` : ''}
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteLink}" 
                 style="background: #3B82F6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;">
                Accept Invitation
              </a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px; margin-top: 30px;">
              This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
            </p>
          </div>
          
          <div style="background: #F9FAFB; padding: 20px; text-align: center; border-top: 1px solid #E5E7EB;">
            <p style="color: #6B7280; font-size: 12px; margin: 0;">
              © 2024 Barangay Mo. Connecting communities across the Philippines.
            </p>
          </div>
        </div>
      `
    })

    if (emailError) {
      throw emailError
    }

    return new Response(
      JSON.stringify({ success: true, invitation }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error sending invitation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
