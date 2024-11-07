import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ActionType } from '../../../../types/types';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Classify the user message into one of these actions: NONE, CREATE, UPDATE, DELETE. Respond with just the action word."
                },
                {
                    role: "user",
                    content: message
                }
            ],
            model: "gpt-4o-mini",
        });

        const action = completion.choices[0].message.content?.trim().toUpperCase();

        return NextResponse.json({
            action: action === 'CREATE' ? ActionType.Create :
                action === 'UPDATE' ? ActionType.Update :
                    action === 'DELETE' ? ActionType.Delete :
                        ActionType.None
        });
    } catch (error) {
        console.error('Error in analyze-action:', error);
        return NextResponse.json({ action: ActionType.None });
    }
} 