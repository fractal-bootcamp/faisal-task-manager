"use client"

import { useTaskStore } from "../../../store/taskStore";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import DeleteDialog from "@/components/DeleteDialog";
import TaskListItem from "@/components/TaskListItem";

const AllTasksView = () => {
    const { toast } = useToast();
    const {
        tasks,
        isDeleteDialogOpen,
        taskToDelete,
        handleDeleteButtonClick,
        closeDeleteDialog,
        handleDeleteWithToast,
        addTask
    } = useTaskStore();

    // Sort tasks by dueDate
    const sortedTasks = [...tasks].sort((a, b) => {
        if (!a.dueDate || !b.dueDate) return 0;
        return b.dueDate.getTime() - a.dueDate.getTime();
    });

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
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    All Tasks
                </h1>
            </div>

            {/* Delete Confirmation Dialog */}
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={closeDeleteDialog}
                onDelete={handleDelete}
            />

            {/* Tasks Table */}
            <div className="border rounded-lg">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1fr_auto_50px] gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border-b">
                    <div className="font-semibold">Task</div>
                    <div className="font-semibold text-left">Created</div>
                    <div className="font-semibold text-left">Due Date</div>
                    <div className="font-semibold text-left">Status</div>
                    <div className="font-semibold text-left">Priority</div>
                    <div className="font-semibold text-left">Done</div>
                    <div className="font-semibold"></div>
                </div>

                {/* Table Body */}
                <div className="divide-y">
                    {sortedTasks.map((task) => (
                        <TaskListItem
                            key={task.id}
                            task={task}
                            onDelete={(e) => handleDeleteButtonClick(e, task.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllTasksView;
