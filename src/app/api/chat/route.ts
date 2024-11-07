import OpenAI from 'openai';
import { NextResponse } from 'next/server';
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

  console.log('Extracting task for deletion from message:', message);
  console.log('Available tasks:', tasks);

  // First try to find by ID
  const idMatch = message.match(/(?:task #|ID:?\s*)([a-zA-Z0-9-]+)/i);
  if (idMatch) {
    const taskId = idMatch[1];
    const task = tasks.find(t => t.id === taskId);
    console.log('Found task by ID:', task);
    return task;
  }

  // Then try to find by title
  const task = tasks.find(t =>
    message.toLowerCase().includes(t.title.toLowerCase())
  );
  console.log('Found task by title:', task);
  return task;
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

  // Extract priority update
  const priorityMatch = message.match(/priority (?:to |:?\s*)(Low|Medium|High)/i);
  if (priorityMatch) {
    updates.priority = priorityMatch[1].toUpperCase() as PriorityProps;
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

export const POST = async (req: Request) => {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { message } = await req.json();
    console.log('Received message:', message);

    const action = detectActionType(message);
    console.log('Detected action:', action);

    // Handle Update Action
    if (action === ActionType.Update) {
      const result = extractTaskUpdates(message);
      console.log('Update extraction result:', result);

      if (result && Object.keys(result.updates).length > 0) {
        const taskStore = useTaskStore.getState();
        await taskStore.updateTask(result.taskId, result.updates);

        const updatedTask = taskStore.tasks.find(t => t.id === result.taskId);
        console.log('Updated task:', updatedTask);

        return NextResponse.json({
          message: 'Task updated successfully',
          action: ActionType.Update,
          taskId: result.taskId,
          updates: result.updates,
          task: updatedTask
        });
      }
    }

    // Handle Delete Action
    if (action === ActionType.Delete) {
      const taskToDelete = extractTaskForDeletion(message);
      console.log('Task to delete:', taskToDelete);

      if (taskToDelete) {
        const taskStore = useTaskStore.getState();
        const taskCopy = { ...taskToDelete }; // Keep a copy for the response
        await taskStore.deleteTask(taskToDelete.id);

        return NextResponse.json({
          message: 'Task deleted successfully',
          action: ActionType.Delete,
          taskId: taskToDelete.id,
          task: taskCopy
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