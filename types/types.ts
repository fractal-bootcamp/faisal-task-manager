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

// Badge colors for status options
export const STATUS_BADGE_COLORS = {
    'Pending': 'font-semibold bg-gray-200 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200',
    'In Progress': 'font-semibold bg-yellow-200 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    'Completed': 'font-semibold bg-green-200 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
    'Archived': 'font-semibold bg-blue-200 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200'
} as const;

// Badge colors for priority options
export const PRIORITY_BADGE_COLORS = {
    Low: 'font-semibold bg-green-200 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-200',
    Medium: 'font-semibold bg-yellow-200 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-200',
    High: 'font-semibold bg-red-200 text-red-800 hover:bg-red-200 dark:bg-red-900 dark:text-red-200'
} as const;
