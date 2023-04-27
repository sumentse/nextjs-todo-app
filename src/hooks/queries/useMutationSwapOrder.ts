import { useMutation, useQueryClient } from "@tanstack/react-query";
import queryKeys from "./queryKeys";
import { swapOrder } from "@/services/firebaseAPI";
import { SwapOrder } from "@/types";

const swapTaskOrder = async (params: {
  source: SwapOrder;
  target: SwapOrder;
}) => {
  const { source, target } = params || {};
  const response = await swapOrder(source, target);
  return response;
};

const useMutationSwapOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: swapTaskOrder,
    onSettled: () => {
      queryClient.invalidateQueries(queryKeys.listTasks());
    },
  });
};

export default useMutationSwapOrder;
