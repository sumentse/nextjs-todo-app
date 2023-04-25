import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import { update } from "@/services/firebaseAPI";

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
  return useMutation(updateTask, {
    onSuccess: () => {
      queryClient.invalidateQueries(queryKeys.listTasks());
    },
  });
};

export default useMutationUpdateTask;
