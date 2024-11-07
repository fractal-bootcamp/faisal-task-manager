import OpenAI from 'openai';
import { NextResponse, NextRequest } from 'next/server';
import instructor from '@instructor-ai/instructor';
import { useTaskStore } from '../../../../store/taskStore';
import { ActionType, PriorityProps, StatusProps, TaskProps } from '../../../../types/types';
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

// Add a function to find task by ID or title
const findTask = (message: string, tasks: TaskProps[]) => {
  // First try to find by exact ID match (UUID or numeric)
  const idMatch = message.match(/(?:task #|ID:?\s*)([a-zA-Z0-9-]+)/i);
  if (idMatch) {
    const taskId = idMatch[1];
    const taskById = tasks.find(task => task.id === taskId);
    if (taskById) return taskById;
  }

  // Then try to find by title
  return tasks.find(task =>
    task.title.toLowerCase().includes(message.toLowerCase())
  );
};

// Add a function to extract task ID for deletion
const extractTaskForDeletion = (message: string) => {
  const taskStore = useTaskStore.getState();
  const tasks = taskStore.tasks;

  console.log('Current tasks in store:', tasks);

  // First try to find by exact title match
  const task = tasks.find(t =>
    message.toLowerCase().includes(t.title.toLowerCase()) ||
    t.title.toLowerCase() === 'new task' // Special handling for newly created tasks
  );

  if (task) return task;

  // Then try ID match as fallback
  const idMatch = message.match(/(?:task #|ID:?\s*)([a-zA-Z0-9-]+)/i);
  if (idMatch) {
    const taskId = idMatch[1];
    return tasks.find(t => t.id === taskId);
  }

  return null;
};

// Add a function to extract task updates from the message
const extractTaskUpdates = (message: string) => {
  const taskStore = useTaskStore.getState();
  const tasks = taskStore.tasks;

  console.log('Extracting updates from message:', message);
  console.log('Available tasks:', tasks);

  // Find the task first
  const task = extractTaskForDeletion(message);
  if (!task) {
    console.log('No task found for updates');
    return null;
  }

  // Create updates object only if we have valid matches
  const updates: Partial<TaskProps> = {};

  // Extract priority update with improved regex
  const priorityMatch = message.match(/priority\s*(?:to|:)?\s*(Low|Medium|High)/i);
  if (priorityMatch) {
    updates.priority = priorityMatch[1] as PriorityProps;
    console.log('Extracted priority:', updates.priority);
  }

  // Extract status update
  const statusMatch = message.match(/status (?:to |:?\s*)(Pending|In Progress|Completed|Archived)/i);
  if (statusMatch) {
    updates.status = statusMatch[1].replace(' ', '_').toUpperCase() as StatusProps;
  }

  // Extract title update
  const titleMatch = message.match(/title (?:to |:?\s*)["'](.+?)["']/i);
  if (titleMatch) {
    updates.title = titleMatch[1];
  }

  // Extract description update
  const descMatch = message.match(/description (?:to |:?\s*)["'](.+?)["']/i);
  if (descMatch) {
    updates.description = descMatch[1];
  }

  console.log('Extracted updates:', { taskId: task.id, updates });
  return { taskId: task.id, updates };
};

// Handle task creation through chat
export const POST = async (req: NextRequest) => {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    // Extract message and action from request
    const { message, action } = await req.json();
    console.log('Received POST message:', message, 'Action:', action);

    // If delete action is detected, handle it differently
    if (action === ActionType.Delete) {
      const taskStore = useTaskStore.getState();
      const taskToDelete = taskStore.tasks.find(task =>
        task.title.toLowerCase().includes('code review') ||
        task.description.toLowerCase().includes('code review')
      );

      if (taskToDelete) {
        return NextResponse.json({
          message: `Task "${taskToDelete.title}" will be deleted.`,
          action: ActionType.Delete,
          taskId: taskToDelete.id
        });
      }
    }

    // Only proceed with OpenAI completion for task creation if no action detected
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

    // Return AI's message and extracted tasks
    return NextResponse.json({
      message: aiMessage,
      tasks: extractedTasks,
      action: null
    });
  } catch (error) {
    console.error('Error in chat POST route:', error);
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

// Handle task updates through chat
export async function PUT(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log('Received PUT message:', message);

    const result = extractTaskUpdates(message);
    console.log('Update extraction result:', result);

    if (!result || Object.keys(result.updates).length === 0) {
      return NextResponse.json(
        { error: 'No valid updates found in message' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: 'Task updated successfully',
      action: ActionType.Update,
      taskId: result.taskId,
      updates: result.updates
    });
  } catch (error) {
    console.error('Error in chat PUT route:', error);
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    );
  }
}

// Handle task deletions through chat
export async function DELETE(req: NextRequest) {
  try {
    const { message } = await req.json();
    console.log('Received DELETE message:', message);

    const taskToDelete = extractTaskForDeletion(message);
    console.log('Task to delete:', taskToDelete);

    if (!taskToDelete) {
      return NextResponse.json(
        { error: 'No task found to delete' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Task deleted successfully',
      action: ActionType.Delete,
      taskId: taskToDelete.id
    });
  } catch (error) {
    console.error('Error in chat DELETE route:', error);
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    );
  }
} 