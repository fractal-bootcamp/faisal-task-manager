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
          content: `You are a task management assistant. Extract tasks from user messages and format them according to these rules:
          - Keep titles short and clear (max 7 words)
          - Keep descriptions brief but informative (max 20 words)
          - Set appropriate status (PENDING/IN_PROGRESS) and priority (LOW/MEDIUM/HIGH) based on context
          - If no clear task is mentioned, ask the user what task they'd like to create`,
        },
        { role: "user", content: message },
      ],
      functions: [{
        name: "extractTasks",
        description: "Extract tasks from user message",
        parameters: {
          type: "object",
          properties: {
            tasks: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  status: { type: "string", enum: ["Pending", "In Progress"] },
                  priority: { type: "string", enum: ["Low", "Medium", "High"] },
                  dueDate: { type: "string", format: "date-time", nullable: true }
                },
                required: ["title", "description", "status", "priority"]
              }
            }
          },
          required: ["tasks"]
        }
      }],
      function_call: { name: "extractTasks" }, // Force function call
      temperature: 0.7,
    });

    // Get the AI's response message and extracted tasks
    const aiMessage = response.choices[0].message.content || "I'll help you create your tasks.";
    const functionCall = response.choices[0].message.function_call;

    let extractedTasks = [];
    if (functionCall?.arguments) {
      try {
        const parsedArgs = JSON.parse(functionCall.arguments);
        extractedTasks = parsedArgs.tasks || [];
      } catch (error) {
        console.error('Error parsing function arguments:', error);
      }
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