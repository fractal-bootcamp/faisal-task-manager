import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';
import { PriorityProps, StatusProps, TaskFormProps, TaskProps } from "../types/types"

interface TaskStoreProps {
    tasks: TaskProps[];
    task: TaskFormProps;
    // Form handling methods
    handleTitleChange: (title: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleDateChange: (date: Date) => void;
    handleStatusChange: (status: StatusProps) => void;
    handlePriorityChange: (priority: PriorityProps) => void;
    handleCreateTask: () => void;
    handleCancelTask: () => void;
    // New methods for task management
    addTask: (task: TaskProps) => void;
    updateTask: (id: string, updates: Partial<TaskProps>) => void;
    deleteTask: (id: string) => void;
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
    tasks: [], // Initialize empty tasks array
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
        const newTask: TaskProps = {
            ...state.task,
            id: uuidv4(),
            updatedAt: new Date(),
        };
        return {
            tasks: [...state.tasks, newTask],
            task: initialTaskState
        };
    }),

    // Handle cancel - reset form to initial state
    handleCancelTask: () => set(() => ({
        task: initialTaskState
    })),

    // Handle adding a new task
    addTask: (newTask) => set((state) => ({
        tasks: [...state.tasks, newTask]
    })),

    // Handle updating a task
    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
        )
    })),

    // Handle deleting a task
    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
    })),
}))

