import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import {remove} from '@/services/firebaseAPI';

const deleteTask = async (id: string) => {
  const response = await remove(id);
  return response;
};

const useMutationDeleteTask = () => {
  const queryClient = useQueryClient();
  return useMutation(deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.listTasks());
    },
  });
};

export default useMutationDeleteTask;
