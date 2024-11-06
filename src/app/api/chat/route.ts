import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import instructor from '@instructor-ai/instructor';
import { InstructorResponseSchema } from '../../../../types/schemas';

// Initialize OpenAI client with instructor wrapper
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Create instructor client with mode configuration
const openai = instructor({
  client,
  mode: "FUNCTIONS"
});

export const POST = async (req: Request) => {
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
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful task management copilot. Help users create and manage their tasks. 
                    When they want to create a task, extract the task information and make it fun and interesting.
                    Always return at least one task, even if the user's message doesn't explicitly mention tasks.`,
        },
        { role: "user", content: message },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "extractTasks",
            description: "Extract or generate tasks from user message",
            parameters: {
              type: "object",
              properties: InstructorResponseSchema.shape,
              required: ["tasks"]
            },
          },
        },
      ],
      temperature: 0.7,
    });

    // Get the AI's response message and any function calls
    const aiMessage = response.choices[0].message.content;
    const functionCall = response.choices[0].message.function_call;

    let extractedTasks = [];
    if (functionCall && functionCall.arguments) {
      const parsedArgs = JSON.parse(functionCall.arguments);
      extractedTasks = parsedArgs.tasks;
    }

    // Return both the AI's message and the extracted tasks
    return NextResponse.json({
      message: aiMessage,
      tasks: extractedTasks
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