"use client";

import { useTaskStore } from "../../../store/taskStore";
import TaskCard from "@/components/TaskCard";
import { STATUS_OPTIONS } from "../../../types/types";
import { Badge } from "@/components/ui/badge";
import { STATUS_BADGE_COLORS } from "../../../types/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
        handleTaskDateChange
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
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Task</DialogTitle>
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
                                    <TaskCard
                                        key={task.id}
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
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskView;