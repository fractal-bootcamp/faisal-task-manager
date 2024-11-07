import { NextResponse } from 'next/server';
import { useTaskStore } from '../../../../../store/taskStore';
import { TaskProps } from '../../../../../types/types';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const updates: Partial<TaskProps> = await request.json();
        const taskStore = useTaskStore.getState();
        const task = taskStore.tasks.find(t => t.id === params.id);

        if (!task) {
            return NextResponse.json(
                { error: 'Task not found' },
                { status: 404 }
            );
        }

        await taskStore.updateTask(params.id, updates);
        const updatedTask = taskStore.tasks.find(t => t.id === params.id);

        return NextResponse.json({
            message: 'Task updated successfully',
            task: updatedTask
        });
    } catch (error) {
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