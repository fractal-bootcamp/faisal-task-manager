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
