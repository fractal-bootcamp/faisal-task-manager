"use client"

import { Button } from "./ui/button";
import DatePickerWithPresets from "./DatePickerWithPresets";
import StatusOptions from "./StatusOptions";
import PriorityOptions from "./PriorityOptions";
import { useTaskStore } from "../../store/taskStore";
import { TaskCardProps } from "../../types/types";

// Component for creating/editing tasks with form fields for title, description, due date, status and priority
const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    const {
        handleTaskStatusChange,
        handleTaskPriorityChange,
        handleTaskTitleChange,
        handleTaskDescriptionChange,
        handleTaskDateChange,
        handleUpdateTask,
        handleCancelTaskEdit
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

                {/* Form actions */}
                <div className="flex justify-end space-x-3 pt-4">
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
        </form>
    );
};

export default TaskCard;