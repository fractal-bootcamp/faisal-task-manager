"use client";

import { useTaskStore } from "../../../store/taskStore";
import TaskCard from "@/components/TaskCard";
import { STATUS_OPTIONS, StatusProps } from "../../../types/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_COLORS, PRIORITY_BADGE_COLORS } from "../../../utils/styling";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";
import { Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

const TaskView: React.FC = () => {
    const { toast } = useToast();
    const {
        tasks,
        isTaskModalOpen,
        openTaskModal,
        closeTaskModal,
        handleTaskStatusChange,
        handleTaskPriorityChange,
        handleTaskTitleChange,
        handleTaskDescriptionChange,
        handleTaskDateChange,
        isTaskEditModalOpen,
        selectedTask,
        setSelectedTask,
        handleCancelTaskEdit,
        taskToDelete,
        handleDeleteButtonClick,
        isDeleteDialogOpen,
        closeDeleteDialog,
        handleDeleteWithToast,
        addTask,
    } = useTaskStore();

    // Helper function to get task count for a specific status
    const getTaskCount = (status: StatusProps): number => {
        return tasks.filter(task => task.status === status).length;
    };

    const handleDelete = () => {
        if (!taskToDelete) return;

        const deletedTask = handleDeleteWithToast(taskToDelete);
        if (!deletedTask) return;

        toast({
            title: "Task deleted",
            description: `"${deletedTask.title}" has been deleted.`,
            action: (
                <ToastAction
                    altText="Undo"
                    onClick={() => {
                        addTask(deletedTask);
                        toast({
                            description: "Task deletion undone.",
                        });
                    }}
                >
                    Undo
                </ToastAction>
            ),
        });
    };

    return (
        <div className="p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Board</h1>
                <Button
                    variant="secondary"
                    className="text-lg font-semibold px-4 py-6 "
                    onClick={openTaskModal}
                >
                    New Task
                    <span className="ml-2 bg-gray-500 bg-opacity-20 rounded-full w-8 h-8 flex items-center justify-center">
                        +
                    </span>
                </Button>

                {/* Task Creation Modal */}
                <Dialog open={isTaskModalOpen} onOpenChange={closeTaskModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="ml-10 text-gray-600">Create New Task</DialogTitle>
                        </DialogHeader>
                        <TaskForm />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Standalone Delete Dialog */}
            <Dialog
                open={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) closeDeleteDialog();
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="mb-2">Delete Task</DialogTitle>
                        <DialogDescription className="text-md">
                            Are you sure you want to delete this task? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={closeDeleteDialog}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Task Board Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.values(STATUS_OPTIONS).map((status) => (
                    <div key={status} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        {/* Header showing status and count with justify-between */}
                        <h2 className="font-semibold mb-4">
                            <div className="flex items-center justify-between">
                                <Badge className={cn(STATUS_BADGE_COLORS[status], "text-lg")}>
                                    {status}
                                </Badge>
                                <span className="text-gray-600 dark:text-gray-400 mr-2">
                                    {getTaskCount(status as StatusProps)}
                                </span>
                            </div>
                        </h2>
                        {/* Task list container with dynamic height based on content */}
                        <div className="space-y-4 min-h-[200px]">
                            {tasks
                                .filter(task => task.status === status)
                                .map(task => (
                                    <Dialog
                                        key={task.id}
                                        open={isTaskEditModalOpen && selectedTask?.id === task.id}
                                        onOpenChange={(open) => {
                                            if (open) {
                                                setSelectedTask(task);
                                            } else {
                                                handleCancelTaskEdit();
                                            }
                                        }}
                                    >
                                        <DialogTrigger asChild>
                                            <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-medium text-lg">
                                                        {task.title}
                                                    </h3>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-gray-500 hover:text-red-500"
                                                        onClick={(e) => handleDeleteButtonClick(e, task.id)}
                                                    >
                                                        <Trash className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex flex-row justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                                        <Badge variant="outline" className={cn(PRIORITY_BADGE_COLORS[task.priority as keyof typeof PRIORITY_BADGE_COLORS])}>
                                                            {task.priority}
                                                        </Badge>
                                                    </div>
                                                    {task.dueDate && (
                                                        <div className="flex flex-row justify-between">
                                                            <span className="text-sm text-gray-600 dark:text-gray-400">Due:</span>
                                                            <Badge variant="outline" className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 w-fit">
                                                                {task.dueDate.toLocaleDateString()}
                                                            </Badge>
                                                        </div>
                                                    )}
                                                    <div className="flex flex-row justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-400">Created:</span>
                                                        <Badge variant="outline" className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 w-fit">
                                                            {task.createdAt.toLocaleDateString()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-gray-600">Edit Task</DialogTitle>
                                            </DialogHeader>
                                            <TaskCard
                                                task={task}
                                                onStatusChange={(status) =>
                                                    handleTaskStatusChange(task.id, status)}
                                                onPriorityChange={(priority) =>
                                                    handleTaskPriorityChange(task.id, priority)}
                                                onTitleChange={(title) =>
                                                    handleTaskTitleChange(task.id, title)}
                                                onDescriptionChange={(description) =>
                                                    handleTaskDescriptionChange(task.id, description)}
                                                onDateChange={(date) =>
                                                    handleTaskDateChange(task.id, date)}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskView;