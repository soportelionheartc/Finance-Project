import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

/**
 * Creates and configures a nodemailer transporter for Gmail
 * Uses EMAIL_USER and EMAIL_PASS environment variables
 * @returns Configured nodemailer transporter
 */
export function createEmailTransporter(): Transporter {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  } as nodemailer.TransportOptions);
}

/**
 * Generates a professional HTML email template for verification codes
 * Uses Lion Heart Capital branding with gold (#FFC107) theme
 * @param code - The 6-digit verification code
 * @param name - User's name for personalization
 * @param language - Language for the email content ('es' for Spanish, 'en' for English)
 * @returns Object containing the email subject and HTML body
 */
export function getVerificationEmailTemplate(
  code: string,
  name: string,
  language: "es" | "en" = "es"
): { subject: string; html: string } {
  const isSpanish = language === "es";

  const subject = isSpanish
    ? "🔐 Código de Verificación - Lion Heart Capital"
    : "🔐 Verification Code - Lion Heart Capital";

  const greeting = isSpanish ? `Hola ${name},` : `Hello ${name},`;

  const intro = isSpanish
    ? "Has solicitado verificar tu dirección de correo electrónico en Lion Heart Capital."
    : "You have requested to verify your email address at Lion Heart Capital.";

  const codeLabel = isSpanish
    ? "Tu código de verificación es:"
    : "Your verification code is:";

  const expirationWarning = isSpanish
    ? "⏱️ Este código expirará en 15 minutos."
    : "⏱️ This code will expire in 15 minutes.";

  const instruction = isSpanish
    ? "Ingresa este código en la aplicación para completar tu verificación. No compartas este código con nadie."
    : "Enter this code in the application to complete your verification. Do not share this code with anyone.";

  const securityNote = isSpanish
    ? "Si no solicitaste este código, puedes ignorar este correo de forma segura."
    : "If you did not request this code, you can safely ignore this email.";

  const footer = isSpanish
    ? "© 2024 Lion Heart Capital. Todos los derechos reservados."
    : "© 2024 Lion Heart Capital. All rights reserved.";

  const supportText = isSpanish
    ? "¿Necesitas ayuda? Contáctanos en"
    : "Need help? Contact us at";

  const html = `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1a1a2e;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1a1a2e;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" width="100%" max-width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%); padding: 30px 40px; text-align: center;">
              <h1 style="margin: 0; color: #1a1a2e; font-size: 28px; font-weight: bold; letter-spacing: 1px;">
                🦁 LION HEART CAPITAL
              </h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="color: #ffffff; font-size: 18px; margin: 0 0 20px 0;">
                ${greeting}
              </p>
              
              <p style="color: #b8b8b8; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                ${intro}
              </p>

              <p style="color: #b8b8b8; font-size: 14px; margin: 0 0 15px 0; text-align: center;">
                ${codeLabel}
              </p>

              <!-- Verification Code Box -->
              <div style="background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%); border: 2px solid #FFC107; border-radius: 12px; padding: 25px; text-align: center; margin: 0 0 25px 0;">
                <span style="font-size: 42px; font-weight: bold; color: #FFC107; letter-spacing: 12px; font-family: 'Courier New', monospace;">
                  ${code}
                </span>
              </div>

              <!-- Expiration Warning -->
              <div style="background-color: rgba(255, 193, 7, 0.1); border-left: 4px solid #FFC107; padding: 15px 20px; margin: 0 0 25px 0; border-radius: 0 8px 8px 0;">
                <p style="color: #FFC107; font-size: 14px; margin: 0; font-weight: 600;">
                  ${expirationWarning}
                </p>
              </div>

              <p style="color: #b8b8b8; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
                ${instruction}
              </p>

              <hr style="border: none; border-top: 1px solid #2a2a4a; margin: 30px 0;">

              <p style="color: #888888; font-size: 13px; line-height: 1.6; margin: 0;">
                🔒 ${securityNote}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f0f23; padding: 25px 40px; text-align: center;">
              <p style="color: #FFC107; font-size: 12px; margin: 0 0 10px 0;">
                ${supportText} <a href="mailto:soportelionheartc@gmail.com" style="color: #FFC107; text-decoration: none;">soportelionheartc@gmail.com</a>
              </p>
              <p style="color: #666666; font-size: 11px; margin: 0;">
                ${footer}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  return { subject, html };
}

/**
 * Sends a verification email with the provided code
 * Combines the transporter and template to send a professional verification email
 * @param email - Recipient email address
 * @param code - The 6-digit verification code
 * @param name - User's name for personalization
 * @param language - Language for the email content (defaults to 'es' for Spanish)
 * @throws Error if email sending fails
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  name: string,
  language: "es" | "en" = "es"
): Promise<void> {
  const transporter = createEmailTransporter();
  const { subject, html } = getVerificationEmailTemplate(code, name, language);

  const mailOptions = {
    from: `"Lion Heart Capital" <${process.env.EMAIL_USER}>`,
    to: email,
    subject,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(
      `[emailService] Verification email sent successfully to ${email}. MessageId: ${info.messageId}`
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[emailService] Failed to send verification email to ${email}:`,
      errorMessage
    );
    throw new Error(`Failed to send verification email: ${errorMessage}`);
  }
}
