
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@^2.0.0"

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
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
    
    const { to, inviterName, inviterRole, barangayName, dashboardUrl } = await req.json()

    if (!to || !inviterName || !inviterRole || !barangayName || !dashboardUrl) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { data, error } = await resend.emails.send({
      from: 'BarangayMo <noreply@your-domain.com>', // Replace with your verified domain
      to: [to],
      subject: `Invitation to join ${barangayName} Dashboard`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">You're invited to join ${barangayName}</h2>
          
          <p>Hello!</p>
          
          <p><strong>${inviterName}</strong> (${inviterRole}) has invited you to join the ${barangayName} digital dashboard.</p>
          
          <p>The BarangayMo platform helps connect community members and officials to:</p>
          <ul>
            <li>Access community services</li>
            <li>Stay updated with local announcements</li>
            <li>Participate in community events</li>
            <li>Connect with neighbors and officials</li>
          </ul>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}/register" 
               style="background-color: #2563eb; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 6px; display: inline-block;">
              Join ${barangayName}
            </a>
          </div>
          
          <p style="color: #666; font-size: 14px;">
            If you have any questions, please contact ${inviterName} or your local barangay office.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #888; font-size: 12px; text-align: center;">
            This invitation was sent from BarangayMo - Digital Community Platform
          </p>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, messageId: data?.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
