"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskView from "../taskView/page"
import AllTasksView from "../all-tasks/page"

// Dashboard component with tabs for TaskBoard and All Tasks views
const Dashboard = () => {
    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6 px-6">Dashboard</h1>
            <Tabs defaultValue="taskboard" className="w-full">
                {/* Tab triggers */}
                <div className="flex justify-between items-center px-6">
                    <TabsList>
                        <TabsTrigger value="taskboard">Task Board</TabsTrigger>
                        <TabsTrigger value="alltasks">All Tasks</TabsTrigger>
                    </TabsList>
                </div>

                {/* Tab content */}
                <TabsContent value="taskboard">
                    <TaskView />
                </TabsContent>
                <TabsContent value="alltasks">
                    <AllTasksView />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Dashboard 