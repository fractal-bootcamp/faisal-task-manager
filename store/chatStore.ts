import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, TaskProps, StatusProps, PriorityProps, ChatResponse } from "../types/types";
import { ExtractedTask } from "../types/schemas";
import { useTaskStore } from "./taskStore";
import { ActionType } from "../types/types";

interface ChatStoreProps {
    messages: ChatMessage[];
    isLoading: boolean;
    inputValue: string;

    // Chat actions
    sendMessage: (e: React.FormEvent) => Promise<ChatResponse>;
    setInputValue: (value: string) => void;
    clearMessages: () => void;
    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const useChatStore = create<ChatStoreProps>((set, get) => ({
    messages: [],
    isLoading: false,
    inputValue: "",

    handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        set({ inputValue: e.target.value });
    },

    sendMessage: async (e: React.FormEvent) => {
        e.preventDefault();
        const state = get();
        set({ isLoading: true });

        try {
            // Extract action type and task ID before making the API call
            const action = detectActionType(state.inputValue);
            const taskId = extractTaskId(state.inputValue);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: state.inputValue,
                    action,
                    taskId
                }),
            });

            const data = await response.json();

            if (data.action === ActionType.Update && data.taskId && data.updates) {
                // Call the PUT endpoint
                const updateResponse = await fetch(`/api/tasks/${data.taskId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data.updates),
                });
                const updateResult = await updateResponse.json();
                data.tasks = updateResult.task ? [updateResult.task] : [];
            } else if (data.action === ActionType.Delete && data.taskId) {
                // Call the DELETE endpoint
                await fetch(`/api/tasks/${data.taskId}`, {
                    method: 'DELETE',
                });
                data.tasks = [];
            }

            // Add user message first
            const userMessage: ChatMessage = {
                id: uuidv4(),
                role: 'user',
                content: state.inputValue,
                timestamp: new Date(),
            };

            // Update messages with user message
            set((state) => ({
                messages: [...state.messages, userMessage]
            }));

            // Create new message
            const newMessage: ChatMessage = {
                id: uuidv4(),
                role: 'Copilot',
                content: data.message,
                timestamp: new Date(),
                tasks: data.tasks
            };

            set((state) => ({
                messages: [...state.messages, newMessage],
                inputValue: "",
                isLoading: false
            }));

            // Handle different types of responses
            if (data.tasks && data.tasks.length > 0) {
                // Handle task creation (existing logic)
                data.tasks.forEach((task: ExtractedTask) => {
                    const newTask: TaskProps = {
                        id: uuidv4(),
                        title: task.title,
                        description: task.description,
                        status: StatusProps[task.status === "Pending" ? "PENDING" : "IN_PROGRESS"],
                        priority: PriorityProps[task.priority.toUpperCase() as keyof typeof PriorityProps],
                        dueDate: task.dueDate ? new Date(task.dueDate) : null,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                    useTaskStore.getState().addTask(newTask);
                });
            }

            return newMessage;
        } catch (error) {
            console.error('Error:', error);
            set({ isLoading: false });
            throw error;
        }
    },

    setInputValue: (value: string) => set({ inputValue: value }),
    clearMessages: () => set({ messages: [] }),
}));

// Helper functions for action detection
export const detectActionType = (message: string): ActionType | null => {
    const updateKeywords = ['update', 'change', 'modify', 'edit', 'refine', 'improve', 'correct', 'fix'];
    const deleteKeywords = ['delete', 'remove', 'trash', 'cancel', 'erase', 'eliminate', 'clear', 'wipe'];

    message = message.toLowerCase();

    if (updateKeywords.some(keyword => message.includes(keyword))) {
        return ActionType.Update;
    }
    if (deleteKeywords.some(keyword => message.includes(keyword))) {
        return ActionType.Delete;
    }
    return null;
};

const extractTaskId = (message: string): string | null => {
    // Match UUID or numeric ID
    const matches = message.match(/(?:task #|ID:?\s*)([a-zA-Z0-9-]+)/i);
    return matches ? matches[1] : null;
};