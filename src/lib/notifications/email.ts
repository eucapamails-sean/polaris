import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendAlertEmail(to: string, subject: string, html: string) {
  await resend.emails.send({
    from: 'Polaris Alerts <alerts@polaris.app>',
    to,
    subject,
    html,
  });
}
