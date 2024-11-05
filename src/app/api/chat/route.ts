import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { taskCreationSchema } from '../../../../types/schemas';
import { ChatCompletionMessage } from 'openai/resources/chat/types';
import instructor from '@instructor-ai/instructor';

// Initialize OpenAI client with instructor wrapper
const openai = instructor(new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful task management assistant. Help users create and manage their tasks.",
        },
        { role: "user", content: message },
      ],
      functions: [
        {
          name: "createTask",
          description: "Create a new task",
          parameters: taskCreationSchema,
        },
      ],
    });

    return NextResponse.json({ message: response.choices[0].message.content });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 