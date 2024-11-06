import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, TaskProps, StatusProps, PriorityProps } from "../types/types";
import { ExtractedTask } from "../types/schemas";
import { useTaskStore } from "./taskStore";

interface ChatStoreProps {
    messages: ChatMessage[];
    isLoading: boolean;
    inputValue: string;

    // Chat actions
    sendMessage: (e: React.FormEvent) => Promise<ChatMessage>;
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

            // Call your AI endpoint
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: state.inputValue }),
            });

            const data = await response.json();

            // Add copilot message with tasks
            const newMessage: ChatMessage = {
                id: uuidv4(),
                role: 'Copilot',
                content: data.message || "I'll help you create a task.",
                timestamp: new Date(),
                tasks: data.tasks
            };

            set((state) => ({
                messages: [...state.messages, newMessage],
                inputValue: "",
                isLoading: false
            }));

            // If tasks were extracted, add them to the task store
            if (data.tasks && data.tasks.length > 0) {
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