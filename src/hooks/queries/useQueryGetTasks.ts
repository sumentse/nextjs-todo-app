import queryKeys from "./queryKeys";
import { useQuery } from "@tanstack/react-query";
import { read } from "@/services/firebaseAPI";

export interface TaskListResponse {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const getQueryGetTasks = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useQuery({
    queryKey: queryKeys.listTasks(),
    queryFn: read,
  });
};

export default getQueryGetTasks;
