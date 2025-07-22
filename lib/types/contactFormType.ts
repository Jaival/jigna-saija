import { z } from 'zod';

// Enhanced form values type
export type FormValues = {
  name: string;
  email: string;
  subject: string;
  userMessage: string;
};

// Zod schema for validation using v4 APIs
export const contactFormSchema = z.object({
  name: z.string().min(1, { error: 'Your name is required' }),
  email: z.email({ error: 'The email address is required' }),
  subject: z.string().min(1, { error: 'A subject is required' }),
  userMessage: z.string().min(1, { error: 'A message is required' }),
});

// Type for API responses
export type ContactFormResponse = {
  message: string;
  error?: string;
  details?: any;
};

// Default export for backward compatibility
export type { FormValues as default };
