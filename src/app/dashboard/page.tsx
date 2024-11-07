"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TaskView from "../taskView/page"
import AllTasksView from "../all-tasks/page"
import { Chat } from "@/components/Chat"
import { ModeToggle } from "@/components/ThemeToggle"

// Dashboard component with tabs for TaskBoard and All Tasks views
const Dashboard = () => {
    return (
        <div className="container mx-auto py-6">
            <div className="flex">
                <div className="flex-1 pr-[300px]">
                    <Tabs defaultValue="taskboard" className="w-full">
                        {/* Updated tab triggers section to include ModeToggle */}
                        <div className="flex justify-between items-center px-6">
                            <div className="flex items-center gap-4"> {/* Added container for TabsList and ModeToggle */}
                                <TabsList>
                                    <TabsTrigger value="taskboard">Task Board</TabsTrigger>
                                    <TabsTrigger value="alltasks">All Tasks</TabsTrigger>
                                </TabsList>
                                <ModeToggle />
                            </div>
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
                <Chat />
            </div>
        </div>
    )
}

export default Dashboard 