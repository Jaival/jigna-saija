import FormValues from './types/contactFormType';

/**
 * Response type from the contact form API
 */
export interface ContactFormResponse {
  success: boolean;
  message: string;
}

/**
 * Sends contact form data to the server
 * @param data - The form values to be sent
 * @param timeout - Optional timeout in milliseconds (defaults to 8000ms)
 * @returns A promise that resolves to the API response
 * @throws Error if the request fails or times out
 */
export const sendContactForm = async (
  data: FormValues, 
  timeout: number = 8000
): Promise<ContactFormResponse> => {
  // Create an AbortController for timeout handling
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal
    });
    
    // Parse the response JSON regardless of status to extract any error details
    const responseData = await response.json() as ContactFormResponse;
    
    if (!response.ok) {
      throw new Error(responseData.message || `Failed to send message: ${response.status} ${response.statusText}`);
    }
    
    return responseData;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeout}ms`);
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};
