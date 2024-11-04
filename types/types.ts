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
    onStatusChange: (id: string, status: StatusProps) => void;
    onPriorityChange: (id: string, priority: PriorityProps) => void;
    onTitleChange: (id: string, title: string) => void;
    onDateChange: (id: string, date: Date) => void;
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
