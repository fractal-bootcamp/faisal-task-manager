import { z } from "zod";
import { PriorityProps, StatusProps } from "./types";

// Base enums
export const TaskStatusEnum = z.nativeEnum(StatusProps);
export const PriorityEnum = z.nativeEnum(PriorityProps);

// Base task schema for creation
export const taskCreationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    status: TaskStatusEnum,
    priority: PriorityEnum,
    dueDate: z.date().nullable(),
});

// Schema for tasks extracted by AI
export const ExtractedTaskSchema = z.object({
    title: z.string().describe("Make this a short title and describe explicitly what the task is about"),
    description: z.string().describe("Make this a short but detailed description of the task"),
    status: TaskStatusEnum.describe("Set the status of the task to either PENDING, IN_PROGRESS depending on the context of the message and when the task is due. Ask for clarification if needed."),
    priority: PriorityEnum.describe("Set the priority of the task to either LOW, MEDIUM, or HIGH depending on the context of the message."),
    dueDate: z.date().nullable().optional(),
});

// Schema for AI response containing tasks
export const InstructorResponseSchema = z.object({
    tasks: z
        .array(ExtractedTaskSchema)
        .describe(
            "An array of tasks, if there's no task specified then ask the user for more information as you are only responsible for creating tasks."
        )
        .min(1),
});

// Export types
export type TaskCreationInput = z.infer<typeof taskCreationSchema>;
export type ExtractedTask = z.infer<typeof ExtractedTaskSchema>;
export type InstructorResponse = z.infer<typeof InstructorResponseSchema>; 