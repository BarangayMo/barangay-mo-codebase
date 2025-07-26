import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  officialName: string;
  email: string;
  position: string;
  barangay: string;
  resetUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { officialName, email, position, barangay, resetUrl }: WelcomeEmailRequest = await req.json();

    console.log('Sending welcome email to:', email);

    const emailResponse = await resend.emails.send({
      from: "Smart Barangay <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Smart Barangay - Your Account is Ready!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #dc2626; margin: 0;">Welcome to Smart Barangay!</h1>
          </div>
          
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="color: #1f2937; margin-top: 0;">Congratulations, ${officialName}!</h2>
            <p style="color: #4b5563; line-height: 1.6;">
              Your official registration has been approved. You have been granted access to the Smart Barangay platform as a <strong>${position}</strong> for <strong>${barangay}</strong>.
            </p>
          </div>

          <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-bottom: 30px;">
            <h3 style="color: #92400e; margin-top: 0;">Set Up Your Password</h3>
            <p style="color: #78350f; line-height: 1.6; margin-bottom: 20px;">
              To complete your account setup and secure access to the platform, please click the button below to set your password:
            </p>
            <div style="text-align: center;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
                Set My Password
              </a>
            </div>
            <p style="color: #78350f; font-size: 14px; margin-top: 15px; margin-bottom: 0;">
              <strong>Note:</strong> This link will expire in 24 hours for security reasons.
            </p>
          </div>

          <div style="margin-bottom: 30px;">
            <h3 style="color: #1f2937;">What's Next?</h3>
            <ul style="color: #4b5563; line-height: 1.6;">
              <li>Set your secure password using the link above</li>
              <li>Log in to your Smart Barangay account</li>
              <li>Complete your profile information</li>
              <li>Start managing your barangay services digitally</li>
            </ul>
          </div>

          <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin-top: 0;">Need Help?</h3>
            <p style="color: #1e3a8a; line-height: 1.6; margin-bottom: 0;">
              If you have any questions or need assistance, please contact our support team or your system administrator.
            </p>
          </div>

          <div style="text-align: center; padding: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p style="margin: 0;">Smart Barangay Platform</p>
            <p style="margin: 5px 0 0 0;">Digitizing Barangay Services for Better Governance</p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-official-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);