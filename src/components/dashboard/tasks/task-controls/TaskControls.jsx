import React from "react";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";

const TaskControls = ({ task, onEdit, onDelete }) => {
  return (
    <div className="flex gap-2">
      <button
        className="text-[#ffffff] hover:text-[#ef233c] transition duration-300 cursor-pointer"
        onClick={() => onDelete(task)}
        title="Eliminar"
      >
        <AiOutlineDelete />
      </button>
      <button
        className="text-[#ffffff] hover:text-blue-500 transition duration-300 cursor-pointer"
        onClick={() => onEdit(task)}
        title="Editar"
      >
        <AiOutlineEdit />
      </button>
    </div>
  );
};

export default TaskControls;
