import React, { useState } from "react";
import SubTaskItem from "../subtask-item/SubTaskItem";
import ProgressBar from "../progress-bar/ProgressBar";
import TaskControls from "../task-controls/TaskControls";
import { FaCheckCircle } from "react-icons/fa";

const TaskItem = ({ task, onEdit, onDelete }) => {
  const isCompleted = task.status === "Completado";
  const endDate = new Date(task.end_date);
  const now = new Date();
  const diffInDays = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));

  let deadlineLabel = "";
  let deadlineStyle = "";

  if (!isCompleted) {
    if (diffInDays < 0) {
      deadlineLabel = "Vencida";
      deadlineStyle = "text-red-600 font-bold";
    } else if (diffInDays <= 1) {
      deadlineLabel = "Por vencer";
      deadlineStyle = "text-orange-500 font-medium";
    }
  }

  const statusColors = {
    Pendiente: "bg-yellow-100 text-yellow-800",
    "En Progreso": "bg-blue-100 text-blue-800",
    Completado: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`bg-[#1A242F] rounded-2xl p-4 transition-all duration-300 ${
        isCompleted ? "bg-[#001524]" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2
            className={`text-[#ffffff] text-lg font-semibold ${
              isCompleted ? "line-through text-[#000000]" : ""
            }`}
          >
            {task.title}
          </h2>

          <div className="text-sm text-gray-200 flex gap-2 items-center mt-1">
            <span>
              {new Date(task.start_date).toLocaleDateString()} -{" "}
              {endDate.toLocaleDateString()}
            </span>
            {deadlineLabel && (
              <span className={`ml-2 ${deadlineStyle}`}>• {deadlineLabel}</span>
            )}
          </div>

          <div
            className={`mt-2 inline-block px-2 py-1 rounded-2xl text-xs font-semibold uppercase tracking-wide bg-opacity-70 ${
              statusColors[task.status] || "bg-[#52B788] text-white"
            }`}
          >
            {task.status}
          </div>
        </div>

        {/* Ícono de check solo si la tarea está completada */}
        {isCompleted && (
          <FaCheckCircle
            title="Tarea completada"
            className="text-[#52B788] text-sm mr-4"
          />
        )}

        <TaskControls task={task} onEdit={onEdit} onDelete={onDelete} />
      </div>

      {Array.isArray(task.subtasks) && task.subtasks.length > 0 && (
        <div className="mt-4">
          <ProgressBar subtasks={task.subtasks} />
          <div className="mt-2 space-y-2">
            {task.subtasks.map((sub) => (
              <SubTaskItem key={sub.id} subtask={sub} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Filtro para tareas nuevas y antiguas
const TaskList = ({ tasks, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("newest"); // Por defecto, mostrar las más nuevas

  const sortedTasks = tasks.sort((a, b) => {
    const dateA = new Date(a.start_date);
    const dateB = new Date(b.start_date);

    if (filter === "newest") {
      return dateB - dateA; // Ordenar de más reciente a más antiguo
    } else {
      return dateA - dateB; // Ordenar de más antiguo a más reciente
    }
  });

  return (
    <div>
      {/* Filtro de tareas */}
      <div className="mb-4 flex justify-end">
        <select
          className="p-2 border border-gray-300 rounded-lg"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="newest">Tareas Nuevas</option>
          <option value="oldest">Tareas Antiguas</option>
        </select>
      </div>

      {/* Lista de tareas */}
      {sortedTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskItem;
