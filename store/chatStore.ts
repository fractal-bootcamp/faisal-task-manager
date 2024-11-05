import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage } from "../types/types";
import { useTaskStore } from "./taskStore";

interface ChatStoreProps {
    messages: ChatMessage[];
    isLoading: boolean;
    inputValue: string;

    // Chat actions
    sendMessage: (content: string) => Promise<void>;
    setInputValue: (value: string) => void;
    clearMessages: () => void;
}

export const useChatStore = create<ChatStoreProps>((set, get) => ({
    messages: [],
    isLoading: false,
    inputValue: "",

    sendMessage: async (content: string) => {
        set({ isLoading: true });

        // Add user message
        const userMessage: ChatMessage = {
            id: uuidv4(),
            role: 'user',
            content,
            timestamp: new Date(),
        };

        set(state => ({
            messages: [...state.messages, userMessage],
            inputValue: "",
        }));

        try {
            // Call your AI endpoint here
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: content }),
            });

            const data = await response.json();

            // Add assistant message
            const copilotMessage: ChatMessage = {
                id: uuidv4(),
                role: 'Copilot',
                content: data.message,
                timestamp: new Date(),
            };

            set(state => ({
                messages: [...state.messages, copilotMessage],
            }));

        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            set({ isLoading: false });
        }
    },

    setInputValue: (value: string) => set({ inputValue: value }),
    clearMessages: () => set({ messages: [] }),
})); 