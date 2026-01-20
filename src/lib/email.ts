import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendWelcomeEmail(email: string, fullName: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ScriptGo <onboarding@resend.dev>',
      to: email,
      subject: 'Welcome to ScriptGo!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #333;">Welcome to ScriptGo, ${fullName}!</h1>
          <p style="font-size: 16px; color: #555;">We're thrilled to have you on board. ScriptGo is here to help you create amazing social media scripts with the power of AI.</p>
          <p style="font-size: 16px; color: #555;">Start generating your first script today!</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Go to Dashboard</a>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">If you didn't create an account, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { success: false, error };
  }
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ScriptGo <auth@resend.dev>',
      to: email,
      subject: 'Reset Your ScriptGo Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #333;">Reset Your Password</h1>
          <p style="font-size: 16px; color: #555;">We received a request to reset your password. Click the button below to choose a new one.</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">Reset Password</a>
          <p style="font-size: 14px; color: #777; margin-top: 20px;">Or copy and paste this link in your browser:</p>
          <p style="font-size: 12px; color: #0070f3;">${resetLink}</p>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">If you didn't request a password reset, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    return { success: false, error };
  }
}

interface SingleContent {
  visual: string
  audio: string
}

interface CalendarEntry {
  day: number
  title: string
  content: SingleContent
}

export async function sendScriptReadyEmail(email: string, scriptTitle: string, scriptContent: SingleContent | CalendarEntry[]) {
  try {
    const contentHtml = Array.isArray(scriptContent)
      ? (scriptContent as CalendarEntry[]).map((row) => `
          <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #0070f3;">
            <p><strong>Day ${row.day}: ${row.title}</strong></p>
            <p><strong>Visual:</strong> ${row.content.visual}</p>
            <p><strong>Audio:</strong> ${row.content.audio}</p>
          </div>
        `).join('')
      : `
          <div style="margin-bottom: 15px; padding: 10px; background-color: #f9f9f9; border-left: 4px solid #0070f3;">
            <p><strong>Visual:</strong> ${(scriptContent as SingleContent).visual}</p>
            <p><strong>Audio:</strong> ${(scriptContent as SingleContent).audio}</p>
          </div>
        `;

    const { data, error } = await resend.emails.send({
      from: 'ScriptGo <scripts@resend.dev>',
      to: email,
      subject: `Your Script is Ready: ${scriptTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h1 style="color: #333;">Your Script is Ready!</h1>
          <p style="font-size: 16px; color: #555;">Title: <strong>${scriptTitle}</strong></p>
          <div style="margin-top: 20px;">
            ${contentHtml}
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" style="display: inline-block; padding: 12px 24px; background-color: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px;">View in Dashboard</a>
          <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
          <p style="font-size: 12px; color: #999;">Generated by ScriptGo AI.</p>
        </div>
      `,
    });

    if (error) {
      console.error('Error sending script ready email:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Failed to send script ready email:', error);
    return { success: false, error };
  }
}
