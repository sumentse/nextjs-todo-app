import { EditTask } from "@/hooks/queries/useMutationEditTask";
import { SwapOrder } from "@/types";
import { useState } from "react";
import { useDrag, useDrop } from "react-dnd";

interface TaskProp {
  id: string;
  title: string;
  order: number;
  completed: boolean;
  isEditTaskLoading: boolean;
  isDeleteTaskLoading: boolean;
  handleEditTask: (data: EditTask) => void;
  handleDeleteTask: (id: string) => void;
  handleOrderSwap: (source: SwapOrder, target: SwapOrder) => void;
}

const Task = ({
  id,
  title,
  order,
  completed,
  isEditTaskLoading,
  isDeleteTaskLoading,
  handleEditTask,
  handleDeleteTask,
  handleOrderSwap,
}: TaskProp) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(title);

  const [, drag] = useDrag({
    type: "Box",
    item: {
      sourceID: id,
      sourceOrder: order,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop(
    () => ({
      accept: "Box",
      drop: (item: { sourceID: string; sourceOrder: number }) => {
        handleOrderSwap(
          {
            id: item.sourceID,
            order: item.sourceOrder,
          },
          {
            id,
            order,
          }
        );
      },
    }),
    [id, order]
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    handleEditTask({ id, title: inputValue });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setInputValue(title);
    setIsEditing(false);
  };

  const handleToggle = () => handleEditTask({ id, completed: !completed });

  return (
    <div ref={drop}>
      <div
        className="flex items-center justify-between mb-2"
        ref={drag}
        data-item-order={id}
      >
        {isEditing ? (
          <>
            <input
              className="border-b-2 border-teal-500 py-1 px-2 focus:outline-none w-full"
              type="text"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button
              title="save edit"
              className="text-green-500 enabled:hover:text-green-700 mr-2"
              onClick={handleSaveClick}
              disabled={isEditTaskLoading}
            >
              Save
            </button>
            <button
              title="cancel edit"
              className="text-gray-500 hover:text-gray-700"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <div>
              <input
                type="checkbox"
                className="mr-2"
                checked={completed}
                onChange={handleToggle}
              />
              <span className={`${completed ? "line-through" : ""}`}>
                {title}
              </span>
            </div>

            <div className="mr-2">
              <button
                className="mr-2 text-blue-500 hover:text-blue-700"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button
                className="text-red-500 enabled:hover:text-red-700"
                onClick={() => handleDeleteTask(id)}
                disabled={isDeleteTaskLoading}
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default Task;
