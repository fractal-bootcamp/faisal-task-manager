"use client";

import { useTaskStore } from "../../../store/taskStore"
import TaskCard from "@/components/TaskCard"
import { STATUS_OPTIONS, StatusProps } from "../../../types/types"

const TaskView: React.FC = () => {
    const { tasks, updateTask } = useTaskStore()

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Task Board</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.values(STATUS_OPTIONS).map((status) => (
                    <div key={status} className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-lg">
                        <h2 className="font-semibold mb-4">{status}</h2>
                        <div className="space-y-4">
                            {tasks
                                .filter(task => task.status === status)
                                .map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        onStatusChange={(id, status) =>
                                            updateTask(id, { status, updatedAt: new Date() })}
                                        onPriorityChange={(id, priority) =>
                                            updateTask(id, { priority, updatedAt: new Date() })}
                                        onTitleChange={(id, title) =>
                                            updateTask(id, { title, updatedAt: new Date() })}
                                        onDateChange={(id, dueDate) =>
                                            updateTask(id, { dueDate, updatedAt: new Date() })}
                                    />
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TaskView;