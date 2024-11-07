import { NextResponse } from 'next/server';
import { useTaskStore } from '../../../../../store/taskStore';
import { TaskProps } from '../../../../../types/types';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        console.log('PUT request received for task:', params.id);
        const updates: Partial<TaskProps> = await request.json();
        console.log('Updates received:', updates);

        const taskStore = useTaskStore.getState();
        console.log('Current store state:', taskStore);

        const task = taskStore.tasks.find(t => t.id === params.id);
        console.log('Found task:', task);

        if (!task) {
            console.log('Task not found');
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        await taskStore.updateTask(params.id, updates);
        const updatedTask = taskStore.tasks.find(t => t.id === params.id);
        console.log('Task after update:', updatedTask);

        return NextResponse.json({
            message: 'Task updated successfully',
            task: updatedTask
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