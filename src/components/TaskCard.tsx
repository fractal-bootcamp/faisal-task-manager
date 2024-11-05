"use client"

import { Button } from "./ui/button";
import DatePickerWithPresets from "./DatePickerWithPresets";
import StatusOptions from "./StatusOptions";
import PriorityOptions from "./PriorityOptions";
import { useTaskStore } from "../../store/taskStore";
import { TaskCardProps } from "../../types/types";
import { Trash } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

// Component for creating/editing tasks with form fields for title, description, due date, status and priority
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const {
        handleTaskStatusChange,
        handleTaskPriorityChange,
        handleTaskTitleChange,
        handleTaskDescriptionChange,
        handleTaskDateChange,
        handleUpdateTask,
        handleCancelTaskEdit,
        isDeleteDialogOpen,
        openDeleteDialog,
        closeDeleteDialog,
        handleDeleteConfirm
    } = useTaskStore();

    return (
        <form onSubmit={(e) => handleUpdateTask(e, task.id)} className="w-full space-y-8">
            {/* Header section */}
            <div className="border-b pb-4">
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={(e) => handleTaskTitleChange(task.id, e.target.value)}
                    placeholder="Task title..."
                    className="text-3xl font-bold w-full bg-transparent border-none focus:outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Task metadata section - Due date, Status, and Priority displayed in a row */}
            <div className="flex flex-row justify-center gap-4 items-start">
                {/* Due date field with preset options */}
                <div>
                    <DatePickerWithPresets
                        currentDate={task.dueDate}
                        onDateChange={(date) => handleTaskDateChange(task.id, date)}
                    />
                </div>

                {/* Status selection */}
                <div>
                    <StatusOptions
                        currentStatus={task.status}
                        onStatusChange={(status) => handleTaskStatusChange(task.id, status)}
                    />
                </div>

                {/* Priority selection */}
                <div>
                    <PriorityOptions
                        currentPriority={task.priority}
                        onPriorityChange={(priority) => handleTaskPriorityChange(task.id, priority)}
                    />
                </div>
            </div>

            {/* Main form content */}
            <div className="space-y-6">
                {/* Description field */}
                <div className="space-y-2">
                    <textarea
                        id="description"
                        name="description"
                        value={task.description}
                        onChange={(e) => handleTaskDescriptionChange(task.id, e.target.value)}
                        rows={4}
                        placeholder="Task description..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Form actions with delete button on the left and other actions on the right */}
                <div className="flex justify-between items-center pt-4">
                    {/* Delete button with confirmation dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={openDeleteDialog}>
                        <DialogTrigger asChild>
                            <Button
                                variant="destructive"
                                type="button"
                                className="font-semibold"
                            >
                                <Trash className="h-4 w-4" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="mb-2">
                                    Delete Task
                                </DialogTitle>
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
                                    onClick={() => handleDeleteConfirm(task.id)}
                                >
                                    Delete
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Other action buttons */}
                    <div className="flex space-x-3">
                        <Button
                            variant="outline"
                            type="button"
                            onClick={handleCancelTaskEdit}
                            className="font-semibold"
                        >
                            Cancel
                        </Button>
                        <Button type="submit" className="font-semibold">
                            Update Task
                        </Button>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default TaskCard;