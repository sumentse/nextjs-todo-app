import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import { create } from "@/services/firebaseAPI";

export interface AddTask {
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  return useMutation(addTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.listTasks());
    },
  });
};

export default useMutationAddTask;
