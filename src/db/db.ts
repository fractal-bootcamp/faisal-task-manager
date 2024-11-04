// Import required types
import { TaskProps, StatusProps, PriorityProps } from "../../types/types";

// Helper function to create dates relative to today
const createDate = (daysOffset: number = 0): Date => {
    const date = new Date();
    date.setDate(date.getDate() + daysOffset);
    return date;
};

// Sample tasks data with a variety of statuses, priorities and due dates
export const sampleTasks: TaskProps[] = [
    {
        id: "1",
        title: "Complete Project Proposal",
        description: "Draft and finalize the project proposal for the new client including timeline and budget estimates.",
        status: StatusProps.IN_PROGRESS,
        priority: PriorityProps.HIGH,
        createdAt: createDate(-2),
        updatedAt: createDate(-1),
        dueDate: createDate(5),
    },
    {
        id: "2",
        title: "Weekly Team Meeting",
        description: "Prepare agenda and host weekly team sync to discuss project progress and blockers.",
        status: StatusProps.PENDING,
        priority: PriorityProps.MEDIUM,
        createdAt: createDate(-1),
        updatedAt: createDate(-1),
        dueDate: createDate(1),
    },
    {
        id: "3",
        title: "Code Review",
        description: "Review pull requests for the authentication feature branch.",
        status: StatusProps.COMPLETED,
        priority: PriorityProps.HIGH,
        createdAt: createDate(-3),
        updatedAt: createDate(0),
        dueDate: createDate(0),
    },
    {
        id: "4",
        title: "Update Documentation",
        description: "Update API documentation with new endpoints and response formats.",
        status: StatusProps.ARCHIVED,
        priority: PriorityProps.LOW,
        createdAt: createDate(-5),
        updatedAt: createDate(-2),
        dueDate: createDate(-1),
    },
    {
        id: "5",
        title: "Client Presentation",
        description: "Prepare and deliver project progress presentation to the client.",
        status: StatusProps.PENDING,
        priority: PriorityProps.HIGH,
        createdAt: createDate(-1),
        updatedAt: createDate(-1),
        dueDate: createDate(3),
    },
    {
        id: "6",
        title: "Bug Fix: Login Flow",
        description: "Investigate and fix reported issues with the user login authentication process.",
        status: StatusProps.IN_PROGRESS,
        priority: PriorityProps.HIGH,
        createdAt: createDate(-1),
        updatedAt: createDate(0),
        dueDate: createDate(2),
    },
    {
        id: "7",
        title: "Performance Optimization",
        description: "Analyze and optimize database queries for better application performance.",
        status: StatusProps.PENDING,
        priority: PriorityProps.MEDIUM,
        createdAt: createDate(-2),
        updatedAt: createDate(-1),
        dueDate: createDate(4),
    },
    {
        id: "8",
        title: "User Testing Session",
        description: "Conduct user testing session for the new feature release and gather feedback.",
        status: StatusProps.COMPLETED,
        priority: PriorityProps.MEDIUM,
        createdAt: createDate(-4),
        updatedAt: createDate(-1),
        dueDate: createDate(-1),
    },
    {
        id: "9",
        title: "Security Audit",
        description: "Perform security audit of the application and document potential vulnerabilities.",
        status: StatusProps.IN_PROGRESS,
        priority: PriorityProps.HIGH,
        createdAt: createDate(-3),
        updatedAt: createDate(0),
        dueDate: createDate(7),
    },
    {
        id: "10",
        title: "Email Template Design",
        description: "Design and implement new responsive email templates for user notifications.",
        status: StatusProps.ARCHIVED,
        priority: PriorityProps.LOW,
        createdAt: createDate(-7),
        updatedAt: createDate(-3),
        dueDate: createDate(-2),
    }
]; 