import { GoogleGenAI } from '@google/genai';
import { GeneratedUser } from './types';
import * as dotenv from 'dotenv';
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

function buildPrompt(count: number, generatedEmails: Set<string>): string {
  let prompt = `Generate ${count} realistic but fictional users. Each user must include the following fields:

- firstName: A non-empty string (max 40 characters). It must not start or end with spaces, numbers, or special characters.
- lastName: A non-empty string (max 20 characters). It must not start or end with spaces, numbers, or special characters.
- email: Must be a valid email format, max 255 characters.
- password: At least 8 characters, no more than 50. Must include uppercase, lowercase, number, and special symbol.
- address: Non-empty (max 200 characters). Allowed characters: letters, digits, space, comma, dot, slash, and hyphen only.
- city: Non-empty. Only alphanumeric characters.
- state: Non-empty. Only alphanumeric characters.
- country: Non-empty. Only alphanumeric characters.
- postcode: Non-empty. Only nummeric characters. No whitespaces or special characters.
- phone: String of digits only, between 10 and 15 characters.
- dob: Date of birth in YYYY-MM-DD format (age between 18 and 100).
- Example: 
[
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "johndoe@gmail.com",
    "password": "SecurePassword123!",
    "address": "123 Main St, Apt 4B",
    "city": "Springfield",
    "state": "IL",
    "country": "USA",
    "postcode": "62701",
    "phone": "1234567890",
    "dob": "1990-01-01"
  },
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "janeSiper@gmail.com",
    "password": "AnotherSecurePassword456@",
    "address": "456 Elm St, Suite 5",
    "city": "Shelbyville",
    "state": "IL",
    "country": "USA",
    "postcode": "62565",
    "phone": "0987654321",
    "dob": "1985-05-15"
  }
]
`;

  if (generatedEmails.size > 0) {
    prompt += `Avoid emails: ${Array.from(generatedEmails).join(', ')}.\n`;
  }

  prompt += `Output the result strictly as a valid JSON array of user objects. Do not include any explanation or extra text.`;

  return prompt;
}

async function generateUsers(
  count = 5,
  generatedEmails: Set<string>,
): Promise<{
  users: GeneratedUser[];
  generatedEmails: Set<string>;
}> {
  const result = await ai.models.generateContent({
    model: model,
    contents: buildPrompt(count, generatedEmails),
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

  let users: GeneratedUser[] = [];

  try {
    users = JSON.parse(cleanedText) as GeneratedUser[];
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON.', cleanedText);
    throw e;
  }

  const emailSet = new Set<string>();
  for (const user of users) {
    if (user.email && user.email.length > 0) {
      emailSet.add(user.email);
    }
  }

  return {
    users: users,
    generatedEmails: new Set([...generatedEmails, ...emailSet]),
  };
}

export default generateUsers;
