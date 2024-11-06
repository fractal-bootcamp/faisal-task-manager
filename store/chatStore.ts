import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from "../types/types";
import { ExtractedTask } from "../types/schemas";

interface ChatStoreProps {
    messages: ChatMessage[];
    isLoading: boolean;
    inputValue: string;

    // Chat actions
    sendMessage: (e: React.FormEvent) => Promise<void>;
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
        const currentInput = get().inputValue.trim();

        if (!currentInput) return;
        set({ isLoading: true });

        // Add user message
        const userMessage: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content: currentInput,
            timestamp: new Date(),
        };

        set(state => ({
            messages: [...state.messages, userMessage],
            inputValue: "", // Clear input after sending
        }));

        try {
            // Call your AI endpoint here
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput }),
            });

            const data = await response.json();

            // Add copilot message with tasks
            const copilotMessage: ChatMessage = {
                id: uuidv4(),
                role: 'Copilot',
                content: data.message || "I'll help you create a task.",
                timestamp: new Date(),
                tasks: data.tasks
            };

            set(state => ({
                messages: [...state.messages, copilotMessage],
            }));

            // If tasks were extracted, add them to the task store
            if (data.tasks && data.tasks.length > 0) {
                // Assuming you have access to the task store
                // You'll need to implement this part to add tasks to your task management system
                data.tasks.forEach((task: ExtractedTask) => {
                    // Add task to your task store
                    // taskStore.addTask(task);
                });
            }

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setInputValue: (value: string) => set({ inputValue: value }),
    clearMessages: () => set({ messages: [] }),
})); 