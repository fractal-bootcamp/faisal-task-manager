import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import instructor from '@instructor-ai/instructor';
import { useTaskStore } from '../../../../store/taskStore';
import { ActionType, PriorityProps, StatusProps } from '../../../../types/types';
import { detectActionType } from '../../../../store/chatStore';

// Initialize OpenAI client with instructor wrapper
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

// Create instructor client with mode configuration
const openai = instructor({
  client,
  mode: "FUNCTIONS"
});

// Add a function to extract task ID for deletion
const extractTaskForDeletion = (message: string) => {
  const idMatch = message.match(/(?:task #|ID:?\s*)(\d+)/i);
  if (idMatch) return idMatch[1];

  // If no ID found, try to find by title
  const task = findTaskByTitle(message);
  return task ? task.id : null;
};

// Add a function to extract task updates from the message
const extractTaskUpdates = (message: string) => {
  // Try to find by ID first
  const idMatch = message.match(/(?:task #|ID:?\s*)(\d+)/i);
  let taskId = idMatch ? (idMatch[1] || idMatch[2]) : null;

  // If no ID found, try to find by title
  if (!taskId) {
    const task = findTaskByTitle(message);
    if (task) {
      taskId = task.id;
    }
  }

  // Extract priority update
  const priorityMatch = message.match(/priority (?:to |:?\s*)(low|medium|high)/i);
  const priority = priorityMatch ? priorityMatch[1].toUpperCase() : null;

  // Extract status update
  const statusMatch = message.match(/status (?:to |:?\s*)(pending|in progress|completed|archived)/i);
  const status = statusMatch ? statusMatch[1].toUpperCase() : null;

  return {
    taskId,
    updates: {
      ...(priority && { priority: PriorityProps[priority as keyof typeof PriorityProps] }),
      ...(status && { status: StatusProps[status as keyof typeof StatusProps] }),
    }
  };
};

// Add this function after the existing extraction functions
const findTaskByTitle = (title: string) => {
  const tasks = useTaskStore.getState().tasks;
  // Case-insensitive partial match for task titles
  return tasks.find(task =>
    task.title.toLowerCase().includes(title.toLowerCase())
  );
};

export const POST = async (req: Request) => {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    const action = detectActionType(message);

    // Handle Update Action
    if (action === ActionType.Update) {
      const { taskId, updates } = extractTaskUpdates(message);

      if (taskId && Object.keys(updates).length > 0) {
        await useTaskStore.getState().updateTask(taskId, updates);
        return NextResponse.json({
          message: 'Task updated successfully',
          action: ActionType.Update,
          taskId,
          updates
        });
      }
    }

    // Handle Delete Action
    if (action === ActionType.Delete) {
      const taskId = extractTaskForDeletion(message);

      if (taskId) {
        await useTaskStore.getState().deleteTask(taskId);
        return NextResponse.json({
          message: 'Task deleted successfully',
          action: ActionType.Delete,
          taskId
        });
      }
    }

    // Only proceed with OpenAI completion for task creation
    if (!action) {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a task management assistant. You can:
1. Create new tasks from user messages
2. Update existing tasks when users mention task IDs or task titles
3. Delete tasks when users request deletion by task ID or task titles

For task creation:
- Keep titles short and clear (max 7 words)
- Keep descriptions brief but informative (max 20 words)
- Set appropriate status (PENDING/IN_PROGRESS) and priority (LOW/MEDIUM/HIGH) based on context

For task updates and deletions:
- Look for task IDs in the message (format: "task #123" or "ID: 123") or task titles
- Identify if the user wants to update or delete the task
- For updates, extract only the fields that need to be changed (title, description, status, priority, dueDate)
- For deletions, confirm the task ID to be deleted

If no clear task action is mentioned, ask the user what they'd like to do.`,
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
        function_call: { name: "extractTasks" },
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
        tasks: extractedTasks,
        action: null
      });
    }

    // If action was detected but not handled, return error
    return NextResponse.json({
      message: "Could not process the requested action. Please try again.",
      error: true
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