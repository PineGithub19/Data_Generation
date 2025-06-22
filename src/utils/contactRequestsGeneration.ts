import { GoogleGenAI } from '@google/genai';
import { GeneratedContactRequest } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

function buildPrompt(count: number): string {
  let prompt = `Generate ${count} fictional but realistic contact request records.

Each contact request must include:
- name: Required. Cannot be empty, whitespace, or start with a number or special character. Max length: 240 characters.
- email: Required. Must be a valid email format and less than 120 characters.
- subject: A short subject string.
- message: Required. Must be between 50 and 250 characters. Cannot be just whitespace. Must not exceed 250 characters.

Rules:
- Make sure names do not start or end with spaces.
- Do not use real user data.
- Keep the tone of the message field friendly and natural.
- Ensure emails are unique and valid.

Example:
[
  {
    "name": "Sarah Thompson",
    "email": "sarah.thompson@example.com",
    "subject": "Inquiry about services",
    "message": "Hi, I recently visited your website and wanted to know more about the services you offer. Please get back to me with more details."
  },
  {
    "name": "Michael Reyes",
    "email": "michael.reyes@example.com",
    "subject": "Support Request",
    "message": "I'm having trouble accessing my account. I've tried resetting the password but still can't log in. Could someone assist me?"
  }
]
`;

  prompt += `Output the result strictly as a valid JSON array of user objects. Do not include any explanation or extra text.`;

  return prompt;
}

async function generateUsers(count = 5): Promise<GeneratedContactRequest[]> {
  const result = await ai.models.generateContent({
    model: model,
    contents: buildPrompt(count),
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    },
  });

  const rawText = result.text as string;

  const cleanedText = rawText
    .replace(/^```json/, '') // Remove opening block
    .replace(/^```/, '') // Remove generic opening if present
    .replace(/```$/, '') // Remove closing block
    .trim();

  let contacts: GeneratedContactRequest[] = [];

  try {
    contacts = JSON.parse(cleanedText) as GeneratedContactRequest[];
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON.', cleanedText);
    throw e;
  }

  return contacts;
}

export default generateUsers;
