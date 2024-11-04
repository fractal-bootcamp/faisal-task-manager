"use client"

import * as React from "react"
import { HamburgerMenuIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { STATUS_OPTIONS, StatusProps, StatusOptionsProps } from "../../types/types";

const StatusOptions: React.FC<StatusOptionsProps> = ({ currentStatus, onStatusChange }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !currentStatus && "text-muted-foreground"
                    )}
                >
                    <HamburgerMenuIcon className="h-4 w-4" />
                    {currentStatus ? (
                        <Badge variant="default" className="py-1">{currentStatus}</Badge>
                    ) : (
                        <span>Status</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[200px] p-2">
                <div className="flex flex-col space-y-2">
                    {Object.values(STATUS_OPTIONS).map((statusOption) => (
                        <Button
                            key={statusOption}
                            variant="ghost"
                            className="justify-start"
                            onClick={() => onStatusChange(statusOption as StatusProps)}
                        >
                            <Badge variant="secondary" className="py-1">{statusOption}</Badge>
                        </Button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default StatusOptions;