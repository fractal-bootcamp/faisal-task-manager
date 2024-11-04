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
import { PRIORITY_BADGE_COLORS } from "../../types/types";

interface PriorityOptionsProps {
    currentPriority: PriorityProps;
    onPriorityChange: (priority: PriorityProps) => void;
}

const PriorityOptions: React.FC<PriorityOptionsProps> = ({
    currentPriority,
    onPriorityChange
}) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !currentPriority && "text-muted-foreground"
                    )}
                >
                    <TargetIcon className="h-4 w-4" />
                    {currentPriority ? (
                        <Badge variant="default" className={cn(
                            "font-semibold",
                            PRIORITY_BADGE_COLORS[currentPriority]
                        )}>
                            {currentPriority}
                        </Badge>
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
                            onClick={() => onPriorityChange(priorityOption as PriorityProps)}
                        >
                            <Badge variant="secondary" className={cn(
                                "font-semibold",
                                PRIORITY_BADGE_COLORS[priorityOption]
                            )}>
                                {priorityOption}
                            </Badge>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default PriorityOptions;