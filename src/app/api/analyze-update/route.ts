import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ActionType, TaskProps } from '../../../../types/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const { tasks, actionType } = await req.json();
        const taskList = tasks.map((t: TaskProps) =>
            `ID: ${t.id}, Title: ${t.title}, Status: ${t.status}, Priority: ${t.priority}`
        ).join('\n');

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a task management assistant. Given a list of tasks and an action type, identify the task to update and specify the updates to make. Return JSON with taskId and updates object."
                },
                {
                    role: "user",
                    content: `Action Type: ${actionType}\nTasks:\n${taskList}`
                }
            ],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" }
        });

        const result = JSON.parse(completion.choices[0].message.content || '{}');

        return NextResponse.json({
            taskId: result.taskId,
            updates: result.updates || {}
        });
    } catch (error) {
        console.error('Error in analyze-update:', error);
        return NextResponse.json({ taskId: '', updates: {} });
    }
} 