import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import { Task, update } from "@/services/firebaseAPI";

export interface EditTask {
  id: string;
  title?: string;
  completed?: boolean;
}

const updateTask = async (params: EditTask) => {
  const { id, ...data } = params;
  const response = await update(id, data);
  return response;
};

const useMutationUpdateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onMutate: async (data) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.listTasks() });
      const previousTodo =
        queryClient.getQueryData<Task[]>(queryKeys.listTasks()) || [];
      const newToDo = previousTodo.map((todo) => {
        if (todo.id === data.id) {
          return {
            ...todo,
            ...(data.completed !== undefined && { completed: data.completed }),
            ...(data.title && { title: data.title }),
          };
        }
        return todo;
      });

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

export default useMutationUpdateTask;
