import TaskForm from "@/components/TaskForm";
import { PriorityProps, StatusProps } from "../../types/types";

export default function Home() {
  return (
    <div>
      <h1>Task Manager</h1>
      <TaskForm
        title=""
        description=""
        status={StatusProps.EMPTY}
        priority={PriorityProps.EMPTY}
        createdAt={new Date()}
        dueDate={new Date()}
      />
    </div>
  );
}
