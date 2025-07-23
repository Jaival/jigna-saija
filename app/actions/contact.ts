'use server';

import { contactFormSchema } from '@/lib/types/contactFormType';
import { transporter, mailOptions } from '@/lib/transporter';

// Enhanced type for server action response
type ActionState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

function generateEmailContent(data: any) {
  const sanitizedMessage = data.userMessage
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    subject: `New Contact: ${data.subject}`,
    text: `Name: ${data.name}\nEmail: ${data.email}\nMessage: ${data.userMessage}`,
    html: generateEmailHtml(data, sanitizedMessage),
  };
}

function generateEmailHtml(data: any, sanitizedMessage: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<title>New Contact Form Submission</title>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background: #f8fafc;
  }
  
  .container {
    max-width: 600px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  
  .header {
    background: linear-gradient(135deg, #264653 0%, #a40e4c 50%, #bc1058 100%);
    padding: 40px 32px;
    text-align: center;
    color: white;
  }
  
  .header h1 {
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 8px;
    letter-spacing: -0.025em;
  }
  
  .header p {
    font-size: 16px;
    opacity: 0.9;
    font-weight: 400;
  }
  
  .content {
    padding: 40px 32px;
  }
  
  .field-group {
    margin-bottom: 32px;
  }
  
  .field-row {
    display: flex;
    gap: 16px;
    margin-bottom: 20px;
  }
  
  .field-row .field {
    flex: 1;
    margin-bottom: 0;
  }
  
  .field {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 20px;
    margin-bottom: 20px;
    transition: all 0.2s ease;
  }
  
  @media (max-width: 480px) {
    .field-row {
      flex-direction: column;
      gap: 0;
    }
    
    .field-row .field {
      margin-bottom: 20px;
    }
  }
  
  .field:hover {
    border-color: #cbd5e1;
    background: #f1f5f9;
  }
  
  .field-label {
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .field-value {
    font-size: 16px;
    color: #1e293b;
    font-weight: 500;
    word-wrap: break-word;
  }
  
  .message-field {
    background: #fffbf0;
    border: 1px solid #fb923c;
  }
  
  .message-field:hover {
    background: #fef3e2;
    border-color: #ea7c08;
  }
  
  .message-value {
    white-space: pre-wrap;
    line-height: 1.7;
    font-size: 15px;
    color: #374151;
  }
  
  .divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
    margin: 32px 0;
  }
  
  .footer {
    background: #f8fafc;
    padding: 24px 32px;
    text-align: center;
    border-top: 1px solid #e2e8f0;
  }
  
  .footer p {
    font-size: 14px;
    color: #64748b;
    margin-bottom: 8px;
  }
  
  .timestamp {
    font-size: 12px;
    color: #94a3b8;
    font-weight: 500;
  }
  
  .badge {
    display: inline-block;
    background: linear-gradient(135deg, #1d6793 0%, #2278aa 100%);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    box-shadow: 0 2px 4px rgba(29, 103, 147, 0.2);
  }
  
  @media (max-width: 640px) {
    .container {
      margin: 0;
      border-radius: 0;
    }
    
    .header, .content, .footer {
      padding-left: 20px;
      padding-right: 20px;
    }
    
    .header {
      padding-top: 32px;
      padding-bottom: 32px;
    }
    
    .header h1 {
      font-size: 24px;
    }
    
    .content {
      padding-top: 32px;
      padding-bottom: 32px;
    }
  }
</style>
</head>
<body>
<div style="padding: 20px;">
  <div class="container">
    <div class="header">
      <div class="badge">New Inquiry</div>
      <h1>Contact Form Submission</h1>
      <p>You have received a new message from your website</p>
    </div>
    
    <div class="content">
      <div class="field-group">
        <div class="field-row">
          <div class="field">
            <div class="field-label">Full Name</div>
            <div class="field-value">${data.name}</div>
          </div>
          
          <div class="field">
            <div class="field-label">Email Address</div>
            <div class="field-value">${data.email}</div>
          </div>
        </div>
        
        <div class="field">
          <div class="field-label">Subject</div>
          <div class="field-value">${data.subject}</div>
        </div>
      </div>
      
      <div class="divider"></div>
      
      <div class="field message-field">
        <div class="field-label">Message</div>
        <div class="field-value message-value">${sanitizedMessage}</div>
      </div>
    </div>
    
    <div class="footer">
      <p>This message was sent from your website contact form</p>
      <div class="timestamp">Received on ${new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  })}</div>
    </div>
  </div>
</div>
</body>
</html>`;
}

export async function submitContactForm(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    // Extract form data
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('subject') as string,
      userMessage: formData.get('userMessage') as string,
    };

    // Validate input using Zod schema
    const result = contactFormSchema.safeParse(data);

    if (!result.success) {
      return {
        success: false,
        message: 'Validation failed',
        errors: result.error.flatten().fieldErrors,
      };
    }

    // Send email with validated data
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(result.data),
    });

    return {
      success: true,
      message: 'Message sent successfully! Thank you for your inquiry.',
    };
  } catch (error) {
    console.error('Contact form error:', error);
    return {
      success: false,
      message: 'Failed to send message. Please try again later.',
    };
  }
}
