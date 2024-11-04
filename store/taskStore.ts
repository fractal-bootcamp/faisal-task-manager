import { create } from "zustand"
import { PriorityProps, StatusProps, TaskFormProps } from "../types/types"

interface TaskStoreProps {
    task: TaskFormProps;
    // Form handling methods
    handleTitleChange: (title: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleDateChange: (date: Date) => void;
    handleStatusChange: (status: StatusProps) => void;
    handlePriorityChange: (priority: PriorityProps) => void;
    handleCreateTask: () => void;
    handleCancelTask: () => void;
}

// Initial state for the task form
const initialTaskState: TaskFormProps = {
    title: "",
    description: "",
    status: StatusProps.EMPTY,
    priority: PriorityProps.EMPTY,
    dueDate: null,
    createdAt: new Date(),
}

export const useTaskStore = create<TaskStoreProps>((set) => ({
    // Initial state
    task: initialTaskState,

    // Handle title change
    handleTitleChange: (title: string) => set((state) => ({
        task: { ...state.task, title }
    })),

    // Handle description change
    handleDescriptionChange: (description: string) => set((state) => ({
        task: { ...state.task, description }
    })),

    // Handle date change
    handleDateChange: (date: Date) => set((state) => ({
        task: { ...state.task, dueDate: date }
    })),

    // Handle status change
    handleStatusChange: (status: StatusProps) => set((state) => ({
        task: { ...state.task, status }
    })),

    // Handle priority change
    handlePriorityChange: (priority: PriorityProps) => set((state) => ({
        task: { ...state.task, priority }
    })),

    // Handle task creation
    handleCreateTask: () => set((state) => {
        // Here you can add additional logic like API calls
        console.log('Task created:', state.task)
        return { task: initialTaskState } // Reset form after creation
    }),

    // Handle cancel - reset form to initial state
    handleCancelTask: () => set(() => ({
        task: initialTaskState
    })),
}))

