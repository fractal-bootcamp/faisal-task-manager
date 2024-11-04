"use client";

import { useTaskStore } from "../../../store/taskStore";
import TaskCard from "@/components/TaskCard";
import { STATUS_OPTIONS } from "../../../types/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_COLORS } from "../../../types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import TaskForm from "@/components/TaskForm";

const TaskView: React.FC = () => {
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
        handleCancelTaskEdit
    } = useTaskStore();

    return (
        <div className="p-6">
            {/* Header section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Task Board</h1>
                <Button
                    variant="secondary"
                    className="text-lg font-semibold px-4 py-6"
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

            {/* Task Board Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.values(STATUS_OPTIONS).map((status) => (
                    <div key={status} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h2 className="font-semibold mb-4 flex items-center">
                            <Badge className={cn(STATUS_BADGE_COLORS[status], "text-lg")}>
                                {status}
                            </Badge>
                        </h2>
                        <div className="space-y-4">
                            {tasks
                                .filter(task => task.status === status)
                                .map(task => (
                                    // Using Dialog component to show TaskCard in a modal
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
                                            {/* Preview card that opens the dialog */}
                                            <div className="p-4 bg-white dark:bg-zinc-800 rounded-lg shadow cursor-pointer hover:shadow-md transition-shadow">
                                                <h3 className="font-medium mb-2 text-xl">{task.title}</h3>
                                                <div className="flex flex-col gap-2">
                                                    <Badge variant="outline" className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 w-fit">
                                                        Priority: {task.priority}
                                                    </Badge>
                                                    <Badge variant="outline" className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 w-fit">
                                                        Due: {task.dueDate?.toLocaleDateString()}
                                                    </Badge>
                                                    <Badge variant="outline" className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200 w-fit">
                                                        Created: {task.createdAt.toLocaleDateString()}
                                                    </Badge>
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