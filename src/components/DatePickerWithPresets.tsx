"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useTaskStore } from "../../store/taskStore";
export function DatePickerWithPresets() {
    const { task, handleDateChange } = useTaskStore();

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !task.dueDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
                    {task.dueDate ? format(task.dueDate, "PPP") : <span>Due date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="flex w-auto flex-col space-y-2 p-2"
            >
                <Select
                    onValueChange={(value) =>
                        handleDateChange(addDays(new Date(), parseInt(value)))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Preset dates" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                        <SelectItem value="0">Today</SelectItem>
                        <SelectItem value="1">Tomorrow</SelectItem>
                        <SelectItem value="3">In 3 days</SelectItem>
                        <SelectItem value="7">In a week</SelectItem>
                        <SelectItem value="14">In two weeks</SelectItem>
                        <SelectItem value="30">In a month</SelectItem>
                    </SelectContent>
                </Select>
                <div className="rounded-md border">
                    <Calendar
                        mode="single"
                        selected={task.dueDate || undefined}
                        onSelect={(date) => date && handleDateChange(date)}
                        initialFocus
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}
