import { TaskFormProps, STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../types/types";
import { Button } from "./ui/button";
import { DatePickerWithPresets } from "./DatePickerWithPresets";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { StatusOptions } from "./StatusOptions";
import { PriorityOptions } from "./PriorityOptions";

const TaskForm: React.FC<TaskFormProps> = ({
    title,
    description,
    status,
    priority,
    dueDate,
}) => {
    return (
        <form className="max-w-3xl mx-auto p-6 space-y-8">
            {/* Header section */}
            <div className="border-b pb-4">
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={title}
                    placeholder="Task title..."
                    className="text-3xl font-bold w-full bg-transparent border-none focus:outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Task metadata section - Due date, Status, and Priority displayed in a row */}
            <div className="flex flex-row justify-center gap-4 items-start">
                {/* Due date field with preset options */}
                <div>
                    <DatePickerWithPresets />
                </div>

                {/* Status selection */}
                <div>
                    <StatusOptions />
                </div>

                {/* Priority selection */}
                <div>
                    <PriorityOptions />
                </div>
            </div>

            {/* Main form content */}
            <div className="space-y-6">
                {/* Description field */}
                <div className="space-y-2">
                    <textarea
                        id="description"
                        name="description"
                        value={description}
                        rows={4}
                        placeholder="Task description..."
                        className="w-full p-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Form actions */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" type="button">
                        Cancel
                    </Button>
                    <Button type="submit">
                        Create Task
                    </Button>
                </div>
            </div>
        </form >
    );
};

export default TaskForm;