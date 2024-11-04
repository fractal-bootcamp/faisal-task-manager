import { create } from "zustand"
import { v4 as uuidv4 } from 'uuid';
import { PriorityProps, StatusProps, TaskFormProps, TaskProps } from "../types/types"
import { sampleTasks } from "../src/db/db";

interface TaskStoreProps {
    tasks: TaskProps[];
    task: TaskFormProps;
    isTaskModalOpen: boolean;
    isTaskEditModalOpen: boolean;
    selectedTask: TaskProps | null;

    // Form handlers
    handleTitleChange: (title: string) => void;
    handleDescriptionChange: (description: string) => void;
    handleDateChange: (date: Date) => void;
    handleStatusChange: (status: StatusProps) => void;
    handlePriorityChange: (priority: PriorityProps) => void;

    // Task update handlers
    handleTaskStatusChange: (id: string, status: StatusProps) => void;
    handleTaskPriorityChange: (id: string, priority: PriorityProps) => void;
    handleTaskTitleChange: (id: string, title: string) => void;
    handleTaskDescriptionChange: (id: string, description: string) => void;
    handleTaskDateChange: (id: string, date: Date) => void;

    // Task handlers
    handleCreateTask: (e: React.FormEvent) => void;
    handleCancelTask: () => void;
    handleSubmitTask: () => void;

    // Modal handlers
    openTaskModal: () => void;
    closeTaskModal: () => void;

    // Task operations
    addTask: (task: TaskProps) => void;
    updateTask: (id: string, updates: Partial<TaskProps>) => void;
    deleteTask: (id: string) => void;

    // Update handlers
    handleUpdateTask: (e: React.FormEvent, id: string) => void;
    handleCancelTaskEdit: () => void;

    // Task handlers
    setSelectedTask: (task: TaskProps | null) => void;
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
    tasks: sampleTasks,
    task: initialTaskState,
    isTaskModalOpen: false,
    isTaskEditModalOpen: false,
    selectedTask: null,

    // Form handlers for updating the current task form state
    handleTitleChange: (title) => set((state) => ({
        task: { ...state.task, title }
    })),

    handleDescriptionChange: (description) => set((state) => ({
        task: { ...state.task, description }
    })),

    handleDateChange: (date) => set((state) => ({
        task: { ...state.task, dueDate: date }
    })),

    handleStatusChange: (status) => set((state) => ({
        task: { ...state.task, status }
    })),

    handlePriorityChange: (priority) => set((state) => ({
        task: { ...state.task, priority }
    })),

    // Task update handlers for modifying existing tasks
    handleTaskStatusChange: (id, status) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, status, updatedAt: new Date() } : task
        )
    })),

    handleTaskPriorityChange: (id, priority) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, priority, updatedAt: new Date() } : task
        )
    })),

    handleTaskTitleChange: (id, title) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, title, updatedAt: new Date() } : task
        )
    })),

    handleTaskDescriptionChange: (id, description) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, description, updatedAt: new Date() } : task
        )
    })),

    handleTaskDateChange: (id, date) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, dueDate: date, updatedAt: new Date() } : task
        )
    })),

    // Task creation and cancellation handlers
    handleCreateTask: (e) => {
        e.preventDefault();
        set((state) => {
            const newTask: TaskProps = {
                ...state.task,
                id: uuidv4(),
                updatedAt: new Date(),
            };
            return {
                tasks: [...state.tasks, newTask],
                task: initialTaskState,
                isTaskModalOpen: false
            };
        });
    },

    handleCancelTask: () => set(() => ({
        task: initialTaskState,
        isTaskModalOpen: false
    })),

    // Task submission handler
    handleSubmitTask: () => set((state) => {
        const newTask: TaskProps = {
            ...state.task,
            id: uuidv4(),
            updatedAt: new Date(),
        };
        return {
            tasks: [...state.tasks, newTask],
            task: initialTaskState,
            isTaskModalOpen: false
        };
    }),

    // Modal visibility handlers
    openTaskModal: () => set({ isTaskModalOpen: true }),
    closeTaskModal: () => set({ isTaskModalOpen: false }),

    // Task CRUD operations
    addTask: (newTask) => set((state) => ({
        tasks: [...state.tasks, newTask]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
        )
    })),

    deleteTask: (id) => set((state) => ({
        tasks: state.tasks.filter(task => task.id !== id)
    })),

    // Task edit handlers
    handleUpdateTask: (e, id) => {
        e.preventDefault();
        set((state) => {
            // Find the task being updated
            const taskToUpdate = state.tasks.find(task => task.id === id);
            if (!taskToUpdate) return state;

            // Update the tasks array with the modified task
            const updatedTasks = state.tasks.map(task =>
                task.id === id
                    ? {
                        ...taskToUpdate,
                        title: task.title,
                        description: task.description,
                        status: task.status,
                        priority: task.priority,
                        dueDate: task.dueDate,
                        updatedAt: new Date()
                    }
                    : task
            );

            return {
                tasks: updatedTasks,
                selectedTask: null,
                isTaskEditModalOpen: false
            };
        });
    },

    handleCancelTaskEdit: () => set(() => ({
        task: initialTaskState,
        isTaskEditModalOpen: false,
        selectedTask: null
    })),

    // Selected task management
    setSelectedTask: (task) => set(() => ({
        selectedTask: task,
        task: task || initialTaskState,
        isTaskEditModalOpen: !!task
    }))
}))
