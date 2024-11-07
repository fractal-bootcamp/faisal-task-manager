import { NextResponse } from 'next/server';
import { useTaskStore } from '../../../../../store/taskStore';
import { ActionType } from '../../../../../types/types';
import { extractTaskUpdates } from '../../../../../store/chatStore';
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { message, action, currentTasks } = await request.json();
        console.log('PUT request received for task:', params.id);
        // Extract updates from the message and current tasks
        const updates = extractTaskUpdates(message, currentTasks);
        if (updates === undefined || updates === null) {
            return NextResponse.json(
                { error: 'No valid updates found' },
                { status: 400 }
            );
        }
        // Get the task store instance
        const taskStore = useTaskStore.getState();
        // Update the task with the extracted updates
        await taskStore.updateTask(params.id, updates);
        // Find and store the updated task
        const updatedTask = taskStore.tasks.find(t => t.id === params.id);

        return NextResponse.json({
            message: 'Task updated successfully',
            task: updatedTask,
            action: ActionType.Update
        });
    } catch (error) {
        console.error('Error in PUT route:', error);
        return NextResponse.json(
            { error: 'Failed to update task' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const taskStore = useTaskStore.getState();
        const task = taskStore.tasks.find(t => t.id === params.id);

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        await taskStore.deleteTask(params.id);

        return NextResponse.json({
            message: 'Task deleted successfully'
        });
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to delete task' },
            { status: 500 }
        );
    }
} 