import { z } from "zod";
import { PriorityProps, StatusProps } from "./types";

export const taskCreationSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string(),
    status: z.nativeEnum(StatusProps),
    priority: z.nativeEnum(PriorityProps),
    dueDate: z.date().nullable(),
});

export type TaskCreationInput = z.infer<typeof taskCreationSchema>; 