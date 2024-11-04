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
import { DatePickerWithPresetsProps } from "../../types/types";

const DatePickerWithPresets: React.FC<DatePickerWithPresetsProps> = ({ currentDate, onDateChange }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-[200px] justify-start text-left font-normal",
                        !currentDate && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {currentDate ? format(currentDate, "PPP") : <span>Due date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="flex w-auto flex-col space-y-2 p-2">
                <Select
                    onValueChange={(value) =>
                        onDateChange(addDays(new Date(), parseInt(value)))
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
                        selected={currentDate || undefined}
                        onSelect={(date) => date && onDateChange(date)}
                        initialFocus
                    />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DatePickerWithPresets;