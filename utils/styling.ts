import { StatusProps } from "../types/types";

import { PriorityProps } from "../types/types";

// Badge colors for status options
export const STATUS_BADGE_COLORS = {
    [StatusProps.PENDING]: 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    [StatusProps.IN_PROGRESS]: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [StatusProps.COMPLETED]: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200',
    [StatusProps.ARCHIVED]: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
} as const;

// Badge colors for priority options
export const PRIORITY_BADGE_COLORS = {
    [PriorityProps.LOW]: 'bg-green-200 text-green-900 dark:bg-green-900 dark:text-green-200',
    [PriorityProps.MEDIUM]: 'bg-yellow-200 text-yellow-900 dark:bg-yellow-900 dark:text-yellow-200',
    [PriorityProps.HIGH]: 'bg-red-500 text-red-900 dark:bg-red-900 dark:text-red-200'
} as const;