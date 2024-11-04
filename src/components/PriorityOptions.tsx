"use client"
// Import required dependencies
import * as React from "react"
import { TargetIcon } from "@radix-ui/react-icons" // Changed from FlagIcon to CircleIcon since FlagIcon is not exported

// Import local utilities and components
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { PRIORITY_OPTIONS, PriorityProps } from "../../types/types";
import { useTaskStore } from "../../store/taskStore"

const PriorityOptions: React.FC = () => {
    const { task, handlePriorityChange } = useTaskStore();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !task.priority && "text-muted-foreground"
                    )}
                >
                    <TargetIcon className="h-4 w-4" />
                    {task.priority ? (
                        <Badge variant="default" className="py-1">{task.priority}</Badge>
                    ) : (
                        <span>Priority</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-2">
                <div className="flex flex-col space-y-2">
                    {Object.values(PRIORITY_OPTIONS).map((priorityOption) => (
                        <Button
                            key={priorityOption}
                            variant="ghost"
                            className="justify-start"
                            onClick={() => handlePriorityChange(priorityOption as PriorityProps)}
                        >
                            <Badge variant="secondary" className="py-1">{priorityOption}</Badge>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PriorityOptions;