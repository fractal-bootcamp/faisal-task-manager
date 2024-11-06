"use client"

import { Button } from "./ui/button";
import DatePickerWithPresets from "./DatePickerWithPresets";
import StatusOptions from "./StatusOptions";
import PriorityOptions from "./PriorityOptions";
import { useTaskStore } from "../../store/taskStore";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";

// Component for creating/editing tasks with form fields for title, description, due date, status and priority
const TaskForm: React.FC = () => {
    const { toast } = useToast();
    const {
        task,
        handleTitleChange,
        handleDescriptionChange,
        handleDateChange,
        handleStatusChange,
        handlePriorityChange,
        handleCreateTask,
        handleCancelTask,
        deleteTask,
        closeTaskModal
    } = useTaskStore();

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();

        // Check if status is empty
        if (!task.status) {
            toast({
                title: `❌❌ Status Required ❌❌`,
                description: "Please select a status for the task.",
                variant: "destructive",
            });
            return;
        }

        const taskId = handleCreateTask(e);

        // Show success toast with undo action
        toast({
            title: "Task created successfully",
            description: `"${task.title}" has been created.`,
            action: (
                <ToastAction
                    altText="Undo"
                    onClick={() => {
                        deleteTask(taskId);
                        closeTaskModal();
                        toast({
                            description: "Task creation undone.",
                        });
                    }}
                >
                    Undo
                </ToastAction>
            ),
        });
    };

    return (
        <form className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Header section */}
            <div className="border-b pb-4">
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={task.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
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
                        onDateChange={(date) => handleDateChange(date)}
                    />
                </div>

                {/* Status selection with required indicator */}
                <div className="space-y-2">
                    <StatusOptions
                        currentStatus={task.status}
                        onStatusChange={handleStatusChange}
                    />
                </div>

                {/* Priority selection */}
                <div>
                    <PriorityOptions
                        currentPriority={task.priority}
                        onPriorityChange={(priority) => handlePriorityChange(priority)}
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
                        onChange={(e) => handleDescriptionChange(e.target.value)}
                        rows={4}
                        placeholder="Task description..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" type="button" onClick={handleCancelTask}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleCreate}>
                        Create Task
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm;