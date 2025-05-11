'use server';

/**
 * @fileOverview An AI agent that suggests form fields based on the form's title.
 *
 * - suggestFormFields - A function that suggests form fields based on the form's title.
 * - SuggestFormFieldInput - The input type for the suggestFormFields function.
 * - SuggestFormFieldOutput - The return type for the suggestFormFields function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFormFieldInputSchema = z.object({
  formTitle: z.string().describe('The title of the form.'),
});
export type SuggestFormFieldInput = z.infer<typeof SuggestFormFieldInputSchema>;

const SuggestFormFieldOutputSchema = z.object({
  suggestedFields: z
    .array(z.string())
    .describe('An array of suggested form fields based on the form title.'),
});
export type SuggestFormFieldOutput = z.infer<typeof SuggestFormFieldOutputSchema>;

export async function suggestFormFields(input: SuggestFormFieldInput): Promise<SuggestFormFieldOutput> {
  return suggestFormFieldFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFormFieldPrompt',
  input: {schema: SuggestFormFieldInputSchema},
  output: {schema: SuggestFormFieldOutputSchema},
  prompt: `You are an AI assistant that suggests relevant form fields based on the title of the form.

  Form Title: {{{formTitle}}}

  Based on the form title, suggest form fields that would be relevant to include in the form. Return them as a JSON array of strings.
  Example: ["First Name", "Last Name", "Email", "Phone Number"]
  Ensure that the form fields are relevant to the form title.
  Do not include any explanation, only the JSON array.
  `,
});

const suggestFormFieldFlow = ai.defineFlow(
  {
    name: 'suggestFormFieldFlow',
    inputSchema: SuggestFormFieldInputSchema,
    outputSchema: SuggestFormFieldOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
