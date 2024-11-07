import { ExtractedTask } from "./schemas";

export enum StatusProps {
    EMPTY = "",
    PENDING = "Pending",
    IN_PROGRESS = "In Progress",
    COMPLETED = "Completed",
    ARCHIVED = "Archived",
}

export const STATUS_OPTIONS = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    ARCHIVED: "Archived",
} as const;

export enum PriorityProps {
    EMPTY = "",
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
}

export const PRIORITY_OPTIONS = {
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "High",
} as const;

export type TaskProps = {
    id: string;
    title: string;
    description: string;
    status: StatusProps;
    priority: PriorityProps;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | null;
}


export type StatusFormProps = typeof STATUS_OPTIONS;
export type PriorityFormProps = typeof PRIORITY_OPTIONS;
export type TaskFormProps = Omit<TaskProps, "id" | "updatedAt">;

export type TaskViewProps = {
    tasks: TaskProps[];
    status: StatusProps;
}

export interface TaskCardProps {
    task: TaskProps;
    onStatusChange: (status: StatusProps) => void;
    onPriorityChange: (priority: PriorityProps) => void;
    onTitleChange: (title: string) => void;
    onDescriptionChange: (description: string) => void;
    onDateChange: (date: Date) => void;
}

export interface StatusOptionsProps {
    currentStatus: StatusProps;
    onStatusChange: (status: StatusProps) => void;
}

export interface PriorityOptionsProps {
    currentPriority: PriorityProps;
    onPriorityChange: (priority: PriorityProps) => void;
}

export interface DatePickerWithPresetsProps {
    currentDate: Date | null;
    onDateChange: (date: Date) => void;
}

// Add task update handlers types
export interface TaskUpdateHandlers {
    onStatusChange: (id: string, status: StatusProps) => void;
    onPriorityChange: (id: string, priority: PriorityProps) => void;
    onTitleChange: (id: string, title: string) => void;
    onDescriptionChange: (id: string, description: string) => void;
    onDateChange: (id: string, date: Date) => void;
}

// Add these to the existing TaskStoreProps interface
export interface TaskStoreProps extends TaskUpdateHandlers {
    // ... existing properties
    handleUpdateTask: (e: React.FormEvent, id: string) => void;
    handleCancelTaskEdit: () => void;
    isTaskEditModalOpen: boolean;
    selectedTask: TaskProps | null;
    setSelectedTask: (task: TaskProps | null) => void;
}

// Chat message types
export interface ChatMessage {
    id: string;
    role: 'user' | 'Copilot';
    content: string;
    timestamp: Date;
    tasks?: ExtractedTask[];
}

export interface TaskCreationSchema {
    title: string;
    description: string;
    status: StatusProps;
    priority: PriorityProps;
    dueDate: Date | null;
}

// Define an enum for action types
export enum ActionType {
    None = 'none',
    Update = 'update',
    Delete = 'delete',
    Create = 'create',
}

export interface ChatResponse extends ChatMessage {
    action?: ActionType;
    message?: string;
    taskId?: string;
    updates?: Partial<TaskProps>;
}
