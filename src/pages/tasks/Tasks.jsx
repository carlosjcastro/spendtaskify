import React, { useState, useEffect } from "react";
import {
  AiOutlinePlus,
  AiOutlineAppstore,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import TaskItem from "../../components/dashboard/tasks/task-item/TaskItem";
import TaskModal from "../../components/dashboard/tasks/task-modal/TaskModal";
import { supabase } from "../../supabaseClient";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setTasks(data);
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(true);
  };

  const handleDelete = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskToDelete.id);

    if (!error) {
      fetchTasks();
      setShowDeleteModal(false);
    } else {
      console.error("Error al eliminar la tarea:", error);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="bg-[#0d1b2a] p-6 min-h-screen">
      <div className="bg-[#0d1b2a] flex justify-between items-center mb-6">
        <h1 className="text-[#ffffff] text-3xl font-bold">Mis Tareas</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#52B788] hover:bg-[#40916C] text-white p-2 rounded-full transition transition-300 cursor-pointer"
        >
          <AiOutlinePlus size={24} />
        </button>
      </div>

      {/* Texto de presentación */}
      <div className="text-[#ffffff] mb-6">
        <p>
          Bienvenido a la sección de tareas. Aquí puedes gestionar todas tus
          tareas:
        </p>
        <ul className="list-disc pl-5">
          <li>Crear nuevas tareas</li>
          <li>Editar tareas existentes</li>
          <li>Eliminar tareas que ya no necesitas</li>
        </ul>
      </div>

      {/* Botones para cambiar entre lista y cuadricula */}
      <div className="flex gap-4 mb-6 lg:flex-row flex-col">
        <button
          onClick={() => setViewMode("list")}
          className="text-[#ffffff] p-2 border rounded-full focus:outline-none hover:bg-gray-100 hover:text-[#000000] transition-all duration-300 cursor-pointer"
        >
          <AiOutlineUnorderedList size={24} />
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className="text-[#ffffff] p-2 border rounded-full focus:outline-none hover:bg-gray-100 hover:text-[#000000] transition-all duration-300 cursor-pointer"
        >
          <AiOutlineAppstore size={24} />
        </button>
      </div>

      <hr className="border-t border-gray-400 my-8 opacity-50" />
      {/* Verificación de tareas */}
      {tasks.length === 0 ? (
        <div className="text-center text-gray-400">
          <p className="mb-4">No tenes tareas actualmente.</p>
          <p className="mb-4">¡Creá una y empezá a ser productivo desde hoy!</p>
          <img
            src="/public/img/tasks/happy.png"
            alt="Cara feliz"
            className="mx-auto w-24 h-24 mb-4"
          />
        </div>
      ) : (
        <div
          className={`transition-all duration-500 grid gap-4 ${
            viewMode === "list"
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {tasks.map((task) => (
            <div key={task.id}>
              <TaskItem
                task={task}
                onEdit={handleEdit}
                onDelete={() => handleDelete(task)}
              />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <TaskModal
          onClose={() => {
            setShowModal(false);
            setEditTask(null);
          }}
          onSaved={fetchTasks}
          task={editTask}
        />
      )}

      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-[#1A242F]/40 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-semibold text-center mb-4">
              Confirmar Eliminación
            </h2>
            <p className="text-center mb-6">
              ¿Estás seguro de que deseas eliminar esta tarea?
            </p>
            <div className="flex justify-between">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-500 bg-gray-200 rounded-full transtition duration-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-white bg-[#ef233c] rounded-full transtition duration-300 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
