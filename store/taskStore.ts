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
    handleCreateTask: (e: React.FormEvent) => string;
    handleCancelTask: () => void;
    handleSubmitTask: () => void;

    // Modal handlers
    openTaskModal: () => void;
    closeTaskModal: () => void;

    // Task CRUD operations
    addTask: (task: TaskProps) => void;
    updateTask: (id: string, updates: Partial<TaskProps>) => void;
    deleteTask: (id: string) => void;

    // Task edit handlers
    handleUpdateTask: (e: React.FormEvent, id: string) => void;
    handleCancelTaskEdit: () => void;

    // Selected task management
    setSelectedTask: (task: TaskProps | null) => void;

    // State and handlers for delete dialog
    isDeleteDialogOpen: boolean;
    openDeleteDialog: () => void;
    closeDeleteDialog: () => void;
    handleDeleteConfirm: (id: string) => void;

    // Add taskToDelete state and its handler
    taskToDelete: string | null;
    setTaskToDelete: (id: string | null) => void;

    // Modify delete dialog handlers
    handleDeleteButtonClick: (e: React.MouseEvent, taskId: string) => void;

    // Add new props for sorting and filtering
    sortField: keyof TaskProps;
    sortDirection: 'asc' | 'desc';
    filterStatus: StatusProps | null;
    filterPriority: PriorityProps | null;

    // Add new handlers
    setSortField: (field: keyof TaskProps) => void;
    setSortDirection: (direction: 'asc' | 'desc') => void;
    setFilterStatus: (status: StatusProps | null) => void;
    setFilterPriority: (priority: PriorityProps | null) => void;

    // Add computed tasks getter
    getSortedAndFilteredTasks: () => TaskProps[];

    handleDeleteWithToast: (taskId: string) => TaskProps | undefined;
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

export const useTaskStore = create<TaskStoreProps>((set, get) => ({
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
    handleTaskStatusChange: (id, status) => {
        console.log('handleTaskStatusChange called:', { id, status });
        set((state) => {
            console.log('Current tasks:', state.tasks);
            const updatedTasks = state.tasks.map(task =>
                task.id === id ? { ...task, status, updatedAt: new Date() } : task
            );
            console.log('Updated tasks:', updatedTasks);
            return { tasks: updatedTasks };
        });
    },

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
    handleCreateTask: (e: React.FormEvent) => {
        e.preventDefault();
        const state = get();
        const newTask: TaskProps = {
            id: uuidv4(),
            title: state.task.title,
            description: state.task.description,
            status: state.task.status,
            priority: state.task.priority,
            dueDate: state.task.dueDate,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        set((state) => ({
            tasks: [...state.tasks, newTask],
            task: initialTaskState,
            isTaskModalOpen: false,
        }));

        return newTask.id; // Return the task ID
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
    addTask: (task: TaskProps) => set((state) => ({
        tasks: [...state.tasks, task]
    })),

    updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map(task =>
            task.id === id ? { ...task, ...updates, updatedAt: new Date() } : task
        )
    })),

    deleteTask: (id) => {
        console.log('deleteTask called:', { id });
        set((state) => {
            console.log('Current tasks before deletion:', state.tasks);
            const filteredTasks = state.tasks.filter(task => task.id !== id);
            console.log('Tasks after deletion:', filteredTasks);
            return { tasks: filteredTasks };
        });
    },

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
    })),

    // Add new state and handlers for delete dialog
    isDeleteDialogOpen: false,

    // Add new handlers for delete dialog
    openDeleteDialog: () => set({ isDeleteDialogOpen: true }),

    closeDeleteDialog: () => set({
        isDeleteDialogOpen: false,
        taskToDelete: null
    }),

    handleDeleteConfirm: (id) => set((state) => {
        // Delete the task and close the dialog
        const updatedTasks = state.tasks.filter(task => task.id !== id);
        return {
            tasks: updatedTasks,
            isDeleteDialogOpen: false,
            taskToDelete: null
        };
    }),

    // Add taskToDelete state and its handler
    taskToDelete: null,

    // Setter for taskToDelete
    setTaskToDelete: (id) => set({ taskToDelete: id }),

    // Modify delete handlers to include taskToDelete management
    handleDeleteButtonClick: (e, taskId) => {
        e.stopPropagation(); // Prevent edit dialog from opening
        set({
            taskToDelete: taskId,
            isDeleteDialogOpen: true
        });
    },

    // Add new state
    sortField: 'dueDate',
    sortDirection: 'desc',
    filterStatus: null,
    filterPriority: null,

    // Add new handlers
    setSortField: (field) => set({ sortField: field }),
    setSortDirection: (direction) => set({ sortDirection: direction }),
    setFilterStatus: (status) => set({ filterStatus: status }),
    setFilterPriority: (priority) => set({ filterPriority: priority }),

    // Add computed tasks getter
    getSortedAndFilteredTasks: () => {
        const state = get();
        let filteredTasks = [...state.tasks];

        // Apply filters
        if (state.filterStatus) {
            filteredTasks = filteredTasks.filter(task => task.status === state.filterStatus);
        }

        if (state.filterPriority) {
            filteredTasks = filteredTasks.filter(task => task.priority === state.filterPriority);
        }

        // Apply sorting
        return filteredTasks.sort((a, b) => {
            const aValue = a[state.sortField];
            const bValue = b[state.sortField];

            if (!aValue || !bValue) return 0;

            const comparison = aValue > bValue ? 1 : -1;
            return state.sortDirection === 'asc' ? comparison : -comparison;
        });
    },

    handleDeleteWithToast: (taskId: string) => {
        console.log('handleDeleteWithToast called:', { taskId });
        const state = get();
        const taskToDelete = state.tasks.find(task => task.id === taskId);
        console.log('Task to delete:', taskToDelete);
        if (!taskToDelete) return;

        // Create a deep copy of the task before deletion
        const taskCopy = { ...taskToDelete };
        console.log('Task copy created:', taskCopy);

        set((state) => ({
            tasks: state.tasks.filter(task => task.id !== taskId),
            isDeleteDialogOpen: false,
            taskToDelete: null
        }));

        return taskCopy;
    },
}))
