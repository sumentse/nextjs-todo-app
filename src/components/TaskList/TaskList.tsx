import { TaskListResponse } from "@/hooks/queries/useQueryGetTasks";
import Task from "../Task";
import { useState, useEffect, useCallback, useMemo } from "react";
import { AddTask } from "@/hooks/queries/useMutationAddTask";
import DOMPurify from "dompurify";
import { EditTask } from "@/hooks/queries/useMutationEditTask";
import { Task as TaskItem } from "@/services/firebaseAPI";
import debounce from "lodash/debounce";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [taskListData, setTaskListData] = useState<TaskItem[]>([]);
  const [input, setInput] = useState<string>("");

  const filterTasks = useCallback(() => {
    if (!searchTerm.trim()) {
      return tasks;
    } else {
      const regex = new RegExp(searchTerm, "i");
      return tasks.filter(({ title }) => {
        return regex.test(title);
      });
    }
  }, [searchTerm, tasks]);

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setSearchTerm(event.target.value);

  const debouncedSearchHandler = useMemo(
    () => debounce(searchHandler, 1000),
    []
  );

  useEffect(() => {
    setTaskListData(filterTasks());
  }, [filterTasks]);

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleAddTaskAndClearInput = () => {
    if (!input.trim()) return;
    handleAddTask({ title: DOMPurify.sanitize(input), completed: false });
    setInput("");
  };

  if (isGetTasksLoading) {
    return null;
  }
  return (
    <div className="pl-5 mt-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <input
        type="text"
        onChange={debouncedSearchHandler}
        placeholder="Search tasks"
        className="border w-full border-gray-300 py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-5"
      />
      <div className="overflow-y-auto h-64">
        {taskListData.map((task) => (
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

      <div className="w-full max-w-lg mb-4">
        <div className="flex items-center border-b-2 border-teal-500 py-2">
          <input
            className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            maxLength={45}
            value={input}
            placeholder="Add todo..."
            onChange={handleUserInput}
          />
          <button
            title="add task"
            className="flex-shrink-0 bg-teal-500 enabled:hover:bg-teal-700 border-teal-500 enabled:hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded disabled:opacity-50"
            type="button"
            disabled={isAddTaskLoading}
            onClick={handleAddTaskAndClearInput}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
