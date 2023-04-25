import { TaskListResponse } from "@/hooks/queries/useQueryGetTasks";
import Task from "../Task";
import { useState } from "react";
import { AddTask } from "@/hooks/queries/useMutationAddTask";
import DOMPurify from "dompurify";
import { EditTask } from "@/hooks/queries/useMutationEditTask";

interface TaskListProps {
  tasks: TaskListResponse[];
  isGetTasksLoading: boolean;
  isDeleteTaskLoading: boolean;
  isAddTaskLoading: boolean;
  isEditTaskLoading: boolean;
  handleAddTask: (data: AddTask) => void;
  handleEditTask: (data: EditTask) => void;
  handleDeleteTask: (id: string) => void;
}

const TaskList = ({
  tasks = [],
  isGetTasksLoading,
  isEditTaskLoading,
  isDeleteTaskLoading,
  isAddTaskLoading,
  handleAddTask,
  handleEditTask,
  handleDeleteTask,
}: TaskListProps) => {
  const [input, setInput] = useState<string>("");

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleAddTaskAndClearInput = () => {
    if (input.length === 0) return;
    handleAddTask({ title: DOMPurify.sanitize(input), completed: false });
    setInput("");
  };

  if (isGetTasksLoading) {
    return null;
  }
  return (
    <div className="list-disc pl-5 mt-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>

      <div className="w-full max-w-sm mb-4">
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            maxLength={100}
            value={input}
            placeholder="Add todo..."
            onChange={handleUserInput}
          />
          <button
            className="flex-shrink-0 bg-teal-500 enabled:hover:bg-teal-700 border-teal-500 enabled:hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:opacity-50"
            type="button"
            disabled={isAddTaskLoading}
            onClick={handleAddTaskAndClearInput}
          >
            Add
          </button>
        </div>
      </div>
      {tasks.map((task) => (
        <Task
          key={task.id}
          handleEditTask={handleEditTask}
          handleDeleteTask={handleDeleteTask}
          isEditTaskLoading={isEditTaskLoading}
          isDeleteTaskLoading={isDeleteTaskLoading}
          {...task}
        />
      ))}
    </div>
  );
};

export default TaskList;
