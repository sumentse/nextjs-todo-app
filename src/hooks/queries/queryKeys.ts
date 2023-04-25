const queryKeys = {
  all: ["todo"],
  listTasks: () => [...queryKeys.all, "tasks"],
};

export default queryKeys;
