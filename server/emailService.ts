import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid if API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const USE_SENDGRID = !!SENDGRID_API_KEY;

if (USE_SENDGRID) {
  sgMail.setApiKey(SENDGRID_API_KEY);
  console.log("[emailService] ✅ SendGrid initialized");
} else {
  console.log(
    "[emailService] ⚠️ SENDGRID_API_KEY not found, using Gmail fallback",
  );
}

// Constants for retry logic
const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 1000; // 1 second

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Determines if an error is transient and should be retried
 */
function isTransientError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    const code = (error as any).code?.toLowerCase() || "";
    return (
      message.includes("timeout") ||
      message.includes("network") ||
      message.includes("econnreset") ||
      message.includes("econnrefused") ||
      message.includes("socket") ||
      code === "etimedout" ||
      code === "econnreset"
    );
  }
  return false;
}

/**
 * Creates and configures a nodemailer transporter for Gmail (fallback)
 * Uses EMAIL_USER and EMAIL_PASS environment variables
 * Includes explicit timeouts to prevent hanging connections
 * @returns Configured nodemailer transporter
 */
export function createEmailTransporter(): Transporter {
  const config = {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Explicit timeouts to prevent hanging in cloud environments (Render, etc.)
    connectionTimeout: 10000, // 10 seconds to establish connection
    greetingTimeout: 5000, // 5 seconds for server greeting
    socketTimeout: 15000, // 15 seconds for socket inactivity
    // Additional settings for better reliability
    pool: false, // Disable connection pooling
    maxConnections: 1, // Limit concurrent connections
  } as nodemailer.TransportOptions;

  console.log(
    `[emailService] Creating Gmail transporter with user: ${process.env.EMAIL_USER}`,
  );
  return nodemailer.createTransport(config);
}

/**
 * Generates a professional HTML email template for verification codes
 * Uses Lion Heart Capital branding with gold (#FFC107) theme
 * @param code - The 6-digit verification code
 * @param name - User's name for personalization
 * @param language - Language for the email content ('es' for Spanish, 'en' for English)
 * @param verificationToken - Optional token for one-click verification link
 * @returns Object containing the email subject and HTML body
 */
export function getVerificationEmailTemplate(
  code: string,
  name: string,
  language: "es" | "en" = "es",
  verificationToken?: string,
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

  const orText = isSpanish
    ? "O haz clic en el siguiente botón para verificar automáticamente:"
    : "Or click the following button to verify automatically:";

  const verifyButtonText = isSpanish
    ? "✅ Verificar mi correo electrónico"
    : "✅ Verify my email address";

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

              ${
                verificationToken
                  ? `
              <!-- One-Click Verification Section -->
              <p style="color: #b8b8b8; font-size: 14px; margin: 0 0 15px 0; text-align: center;">
                ${orText}
              </p>
              
              <div style="text-align: center; margin: 0 0 25px 0;">
                <a href="${process.env.BASE_URL || "http://localhost:5000"}/verify-email-token/${verificationToken}" 
                   style="display: inline-block; background: linear-gradient(135deg, #FFC107 0%, #FF9800 100%); color: #1a1a2e; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.3);">
                  ${verifyButtonText}
                </a>
              </div>
              `
                  : ""
              }

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
 * Uses SendGrid in production, Gmail as fallback for local development
 * Includes retry logic with exponential backoff
 * @param email - Recipient email address
 * @param code - The 6-digit verification code
 * @param name - User's name for personalization
 * @param verificationToken - Optional token for one-click verification link
 * @param language - Language for the email content (defaults to 'es' for Spanish)
 * @throws Error if email sending fails after all retries
 */
export async function sendVerificationEmail(
  email: string,
  code: string,
  name: string,
  verificationToken?: string,
  language: "es" | "en" = "es",
): Promise<void> {
  const { subject, html } = getVerificationEmailTemplate(
    code,
    name,
    language,
    verificationToken,
  );

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const startTime = Date.now();

    try {
      if (USE_SENDGRID) {
        // Use SendGrid (production)
        console.log(
          `[emailService] [SendGrid] Attempt ${attempt}/${MAX_RETRIES}: Sending verification email to ${email}...`,
        );

        await sgMail.send({
          to: email,
          from: {
            email: process.env.EMAIL_USER || "soportelionheartc@gmail.com",
            name: "Lion Heart Capital",
          },
          subject,
          html,
        });

        const duration = Date.now() - startTime;
        console.log(
          `[emailService] ✅ [SendGrid] Verification email sent successfully to ${email} in ${duration}ms`,
        );
        return; // Success!
      } else {
        // Use Gmail (local development fallback)
        console.log(
          `[emailService] [Gmail] Attempt ${attempt}/${MAX_RETRIES}: Sending verification email to ${email}...`,
        );

        const transporter = createEmailTransporter();
        const mailOptions = {
          from: `"Lion Heart Capital" <${process.env.EMAIL_USER}>`,
          to: email,
          subject,
          html,
        };

        const info = await transporter.sendMail(mailOptions);
        const duration = Date.now() - startTime;
        console.log(
          `[emailService] ✅ [Gmail] Verification email sent successfully to ${email} in ${duration}ms. MessageId: ${info.messageId}`,
        );
        return; // Success!
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorCode =
        error instanceof Error && "code" in error
          ? (error as any).code
          : "UNKNOWN";

      console.error(
        `[emailService] ❌ Attempt ${attempt}/${MAX_RETRIES} failed to send verification email to ${email} after ${duration}ms:`,
        `Error Code: ${errorCode}, Message: ${errorMessage}`,
      );

      lastError = error instanceof Error ? error : new Error(errorMessage);

      // Only retry on transient errors
      if (attempt < MAX_RETRIES && isTransientError(error)) {
        const delayMs = INITIAL_DELAY_MS * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`[emailService] ⏳ Retrying in ${delayMs}ms...`);
        await sleep(delayMs);
      } else if (!isTransientError(error)) {
        // Non-transient error, don't retry
        console.error(
          `[emailService] ❌ Non-transient error, aborting retries`,
        );
        break;
      }
    }
  }

  // All retries exhausted
  throw new Error(
    `Failed to send verification email after ${MAX_RETRIES} attempts: ${lastError?.message}`,
  );
}

/**
 * Sends a contact form email using SendGrid (or Gmail fallback)
 * @param name - Sender's name
 * @param email - Sender's email
 * @param message - The contact message
 * @throws Error if email sending fails
 */
export async function sendContactEmail(
  name: string,
  email: string,
  message: string,
): Promise<void> {
  const subject = `Nuevo mensaje de contacto de ${name} <${email}>`;
  const textContent = `Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body style="font-family: Arial, sans-serif; background-color: #1a1a2e; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #16213e; border-radius: 8px; padding: 30px; color: #ffffff;">
    <h2 style="color: #FFC107; margin-top: 0;">📬 Nuevo Mensaje de Contacto</h2>
    <p><strong style="color: #FFC107;">Nombre:</strong> ${name}</p>
    <p><strong style="color: #FFC107;">Email:</strong> <a href="mailto:${email}" style="color: #FFC107;">${email}</a></p>
    <hr style="border: none; border-top: 1px solid #2a2a4a; margin: 20px 0;">
    <p><strong style="color: #FFC107;">Mensaje:</strong></p>
    <div style="background-color: #0f0f23; padding: 15px; border-radius: 8px; border-left: 4px solid #FFC107;">
      <p style="margin: 0; white-space: pre-wrap;">${message}</p>
    </div>
    <hr style="border: none; border-top: 1px solid #2a2a4a; margin: 20px 0;">
    <p style="color: #666; font-size: 12px; text-align: center;">© 2024 Lion Heart Capital</p>
  </div>
</body>
</html>
  `.trim();

  const startTime = Date.now();
  const recipientEmail =
    process.env.EMAIL_USER || "soportelionheartc@gmail.com";

  try {
    if (USE_SENDGRID) {
      console.log(
        `[emailService] [SendGrid] Sending contact email from ${email}...`,
      );

      await sgMail.send({
        to: recipientEmail,
        from: {
          email: recipientEmail,
          name: "Lion Heart Capital - Contacto",
        },
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      const duration = Date.now() - startTime;
      console.log(
        `[emailService] ✅ [SendGrid] Contact email sent in ${duration}ms`,
      );
    } else {
      console.log(
        `[emailService] [Gmail] Sending contact email from ${email}...`,
      );

      const transporter = createEmailTransporter();
      await transporter.sendMail({
        from: recipientEmail,
        to: recipientEmail,
        replyTo: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      const duration = Date.now() - startTime;
      console.log(
        `[emailService] ✅ [Gmail] Contact email sent in ${duration}ms`,
      );
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      `[emailService] ❌ Failed to send contact email after ${duration}ms: ${errorMessage}`,
    );
    throw new Error(`Failed to send contact email: ${errorMessage}`);
  }
}
