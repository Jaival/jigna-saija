import { mailOptions, transporter } from '@/lib/transporter';
import FormValues from '@/lib/types/contactFormType';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define a schema for input validation
const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  userMessage: z.string().min(1, 'Message is required'),
});

const generateEmailContent = (data: FormValues) => {
  // Sanitize user inputs to prevent XSS
  const sanitizedMessage = data.userMessage
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    subject: `New Contact: ${data.subject}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.userMessage}`,
    html: generateEmailHtml(data, sanitizedMessage),
  };
};

// Separate HTML template generation for better maintainability
function generateEmailHtml(data: FormValues, sanitizedMessage: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<title>New Contact Form Submission</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style type="text/css">a,body,table,td{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}table{border-collapse:collapse!important}
body{height:100%!important;margin:0!important;padding:0!important;width:100%!important}
@media screen and (max-width:525px)
{.wrapper{width:100%!important;max-width:100%!important}
.responsive-table{width:100%!important}
.padding{padding:10px 5% 15px 5%!important}
.section-padding{padding:0 15px 50px 15px!important}}
.form-container{margin-bottom:24px;padding:20px;border:1px dashed #ccc}
.form-heading{color:#2a2a2a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:400;text-align:left;line-height:20px;font-size:18px;margin:0 0 8px;padding:0}
.form-answer{color:#2a2a2a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-weight:300;text-align:left;line-height:20px;font-size:16px;margin:0 0 24px;padding:0}
div[style*='margin: 16px 0;']{margin:0!important}
</style>
</head>
<body style="margin:0!important;padding:0!important;background:#fff">
<div style="display:none;font-size:1px;color:#fefefe;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden"></div>
<table border="0" cellpadding="0" cellspacing="0" width="100%"><tr>
<td bgcolor="#ffffff" align="center" style="padding:10px 15px 30px 15px" class="section-padding">
<table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:500px" class="responsive-table">
<tr><td>
<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr><td>
<table width="100%" border="0" cellspacing="0" cellpadding="0"><tr>
<td style="padding:0;font-size:16px;line-height:25px;color:#232323" class="padding message-content">
<h2>New Contact Form Submission</h2>
<div class="form-container">
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Email:</strong> ${data.email}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <p><strong>Message:</strong></p>
  <p>${sanitizedMessage}</p>
</div></td></tr></table></td></tr></table></td></tr></table></td></tr></table></body></html>`;
}

export async function GET() {
  return NextResponse.json(
    { message: 'This endpoint only accepts POST requests' },
    { status: 405 },
  );
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    // Validate input using Zod schema
    const result = contactFormSchema.safeParse(data);

    if (!result.success) {
      const errors = result.error.format();
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 },
      );
    }

    // Send email with validated data
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(data),
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      {
        message: 'Failed to send message. Please try again later.',
      },
      { status: 500 },
    );
  }
}
