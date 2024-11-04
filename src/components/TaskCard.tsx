"use client"

import { format } from "date-fns"
import StatusOptions from "./StatusOptions"
import PriorityOptions from "./PriorityOptions"
import DatePickerWithPresets from "./DatePickerWithPresets"
import { PriorityProps, TaskCardProps } from "../../types/types"

const TaskCard: React.FC<TaskCardProps> = ({
    task,
    onStatusChange,
    onPriorityChange,
    onTitleChange,
    onDateChange
}) => {
    return (
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-700">
            {/* Title */}
            <input
                type="text"
                value={task.title}
                onChange={(e) => onTitleChange(task.id, e.target.value)}
                className="text-lg font-semibold w-full bg-transparent border-none focus:outline-none"
            />

            {/* Metadata */}
            <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Status:</span>
                    <StatusOptions
                        currentStatus={task.status}
                        onStatusChange={(status) => onStatusChange(task.id, status)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Priority:</span>
                    <PriorityOptions
                        currentPriority={task.priority}
                        onPriorityChange={(priority: PriorityProps) => onPriorityChange(task.id, priority)}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-zinc-500">Due:</span>
                    <DatePickerWithPresets
                        currentDate={task.dueDate}
                        onDateChange={(date) => onDateChange(task.id, date)}
                    />
                </div>

                <div className="text-sm text-zinc-500">
                    Created: {format(task.createdAt, "PPP")}
                </div>
            </div>
        </div>
    )
}

export default TaskCard;