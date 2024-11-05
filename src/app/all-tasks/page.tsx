"use client"

import { useTaskStore } from "../../../store/taskStore";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_BADGE_COLORS, StatusProps, PRIORITY_BADGE_COLORS } from "../../../types/types";
import { Checkbox } from "@/components/ui/checkbox";

const AllTasksView = () => {
    const { tasks } = useTaskStore();

    // Sort tasks by dueDate
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return b.dueDate.getTime() - a.dueDate.getTime();
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    All Tasks
                </h1>
            </div>

            {/* Tasks Table */}
            <div className="border rounded-lg">
                {/* Table Header */}
                <div className="grid grid-cols-6 gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border-b">
                    <div className="font-semibold">Name</div>
                    <div className="font-semibold">Created</div>
                    <div className="font-semibold">Due Date</div>
                    <div className="font-semibold">Status</div>
                    <div className="font-semibold">Priority</div>
                    <div className="font-semibold">Done</div>
                </div>

                {/* Table Body */}
                <div className="divide-y">
                    {sortedTasks.map((task) => (
                        <div
                            key={task.id}
                            className="grid grid-cols-6 gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
                        >
                            <div className="font-medium">{task.title}</div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {task.createdAt.toLocaleDateString()}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                {task.dueDate?.toLocaleDateString() || 'No date'}
                            </div>
                            <div>
                                <Badge className={cn(STATUS_BADGE_COLORS[task.status as keyof typeof STATUS_BADGE_COLORS])}>
                                    {task.status}
                                </Badge>
                            </div>
                            <div>
                                <Badge variant="outline" className={cn(PRIORITY_BADGE_COLORS[task.priority as keyof typeof PRIORITY_BADGE_COLORS])}>
                                    {task.priority}
                                </Badge>
                            </div>
                            <div>
                                <Checkbox
                                    checked={task.status === StatusProps.COMPLETED}
                                    className="pointer-events-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllTasksView;
