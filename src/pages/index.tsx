import TaskList from "@/components/TaskList";
import useQueryGetTasks from "@/hooks/queries/useQueryGetTasks";
import useMutationDeleteTask from "@/hooks/queries/useMutationDeleteTask";
import useMutationAddTask, {
  AddTask,
} from "@/hooks/queries/useMutationAddTask";
import useMutationEditTask, {
  EditTask,
} from "@/hooks/queries/useMutationEditTask";
import useMutationSwapTaskOrder from "@/hooks/queries/useMutationSwapOrder";
import { SwapOrder } from "@/types";

const Home = () => {
  const { data: tasks, isLoading: isGetTasksLoading } = useQueryGetTasks();
  const { mutate: deleteTask, isLoading: isDeleteTaskLoading } =
    useMutationDeleteTask();
  const { mutate: addTask, isLoading: isAddTaskLoading } = useMutationAddTask();
  const { mutate: editTask, isLoading: isEditTaskLoading } =
    useMutationEditTask();
  const { mutate: swapTaskOrder } = useMutationSwapTaskOrder();

  const handleAddTask = (data: AddTask) => addTask(data);

  const handleEditTask = (data: EditTask) => editTask(data);

  const handleOrderSwap = (source: SwapOrder, target: SwapOrder) =>
    swapTaskOrder({ source, target });

  const handleDeleteTask = (id: string) => deleteTask(id);

  return (
    <main className="mt-20">
      <div className="w-full max-w-lg mx-auto">
        <TaskList
          handleAddTask={handleAddTask}
          handleDeleteTask={handleDeleteTask}
          handleEditTask={handleEditTask}
          handleOrderSwap={handleOrderSwap}
          isGetTasksLoading={isGetTasksLoading}
          isAddTaskLoading={isAddTaskLoading}
          isDeleteTaskLoading={isDeleteTaskLoading}
          isEditTaskLoading={isEditTaskLoading}
          tasks={tasks || []}
        />
      </div>
    </main>
  );
};

export default Home;
