import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_BADGE_COLORS, PRIORITY_BADGE_COLORS } from "../../types/types";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { TaskListItemProps } from "../../types/types";

const TaskListItem: React.FC<TaskListItemProps> = ({ task, onDelete }) => {
    return (
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_50px] gap-4 p-4 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors items-center">
            <div className="font-medium">{task.title}</div>
            <div className="text-gray-600 dark:text-gray-400 text-left">
                {task.createdAt.toLocaleDateString()}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-left">
                {task.dueDate?.toLocaleDateString() || 'No date'}
            </div>
            <div className="text-left">
                <Badge className={cn(STATUS_BADGE_COLORS[task.status as keyof typeof STATUS_BADGE_COLORS])}>
                    {task.status}
                </Badge>
            </div>
            <div className="text-left">
                <Badge variant="outline" className={cn(PRIORITY_BADGE_COLORS[task.priority as keyof typeof PRIORITY_BADGE_COLORS])}>
                    {task.priority}
                </Badge>
            </div>
            <div className="flex justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500 hover:text-red-500"
                    onClick={(e) => onDelete(e, task.id)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default TaskListItem; 