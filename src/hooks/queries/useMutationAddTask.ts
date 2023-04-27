import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import { Task, create } from "@/services/firebaseAPI";

export interface AddTask {
  title: string;
  completed: boolean;
}

const addTask = async (params: AddTask) => {
  const response = await create({
    ...params,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return response;
};

const useMutationAddTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTask,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.listTasks() });

      const previousTodo =
        queryClient.getQueryData<Task[]>(queryKeys.listTasks()) || [];
      const [lastItem] = previousTodo.slice(-1);
      const newToDo = [
        ...previousTodo,
        { ...data, order: lastItem.order + 1, id: new Date().getTime() },
      ];

      queryClient.setQueryData(queryKeys.listTasks(), newToDo);

      return {
        previousTodo,
        newToDo,
      };
    },
    onError: (err, newTodo, context) => {
      if (context) {
        queryClient.setQueryData(queryKeys.listTasks(), context.previousTodo);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries(queryKeys.listTasks());
    },
  });
};

export default useMutationAddTask;
