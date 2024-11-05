import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { taskCreationSchema } from '../../../../types/schemas';
import instructor from '@instructor-ai/instructor';

// Initialize OpenAI client with instructor wrapper
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});
// Create instructor client with mode configuration
const openai = instructor({
  client,
  mode: "FUNCTIONS" // Set mode to FUNCTIONS for function calling support
});

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Extract message from request body
    const { message } = await req.json();

    // Create chat completion with OpenAI using instructor
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        {
          role: "system",
          content: "You are a helpful task management assistant. Help users create and manage their tasks. When they want to create a task, use the createTask function to structure their request.",
        },
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "createTask",
            description: "Create a new task",
            parameters: {
              type: "object",
              properties: taskCreationSchema.shape,
              required: ["title", "description", "status", "priority"]
            },
          },
        },
      ],
      temperature: 0.7,
    });

    // Return response with message content and function call
    return NextResponse.json({
      message: response.choices[0].message.content,
      function_call: response.choices[0].message.function_call
    });

  } catch (error) {
    console.error('Error in chat route:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
} 