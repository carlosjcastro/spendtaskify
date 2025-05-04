import React, { useState, useEffect } from "react";
import { supabase } from "../../../../supabaseClient";

const TaskModal = ({ onClose, onSaved, task }) => {
  const [title, setTitle] = useState(task?.title || "");
  const [startDate, setStartDate] = useState(task?.start_date || "");
  const [endDate, setEndDate] = useState(task?.end_date || "");
  const [status, setStatus] = useState(task?.status || "Pendiente");
  const [subtasks, setSubtasks] = useState(
    Array.isArray(task?.subtasks)
      ? task.subtasks
      : JSON.parse(task?.subtasks || "[]")
  );
  const [description, setDescription] = useState(task?.description || "");
  const [errors, setErrors] = useState({
    title: "",
    startDate: "",
    endDate: "",
    description: "",
  });

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setStartDate(task.start_date);
      setEndDate(task.end_date);
      setStatus(task.status);
      setSubtasks(task.subtasks || []);
      setDescription(task.description || "");
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {
      title: "",
      startDate: "",
      endDate: "",
      description: "",
    };

    if (!title.trim()) {
      newErrors.title = "El título es obligatorio";
    }

    if (!startDate) {
      newErrors.startDate = "La fecha de inicio es obligatoria";
    }

    if (!endDate) {
      newErrors.endDate = "La fecha de finalización es obligatoria";
    }

    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate =
        "La fecha de finalización no puede ser anterior a la de inicio";
    }

    if (description.length < 10) {
      newErrors.description =
        "La descripción debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("✅ handleSave ejecutado");

    if (!validateForm()) {
      console.warn("❌ Formulario inválido");
      return;
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("❌ No se pudo obtener el usuario");
      return;
    }

    const payload = {
      title,
      start_date: startDate,
      end_date: endDate,
      description,
      status,
      subtasks,
      user_id: user.id,
    };

    console.log(task ? "📝 Modo edición" : "🆕 Modo creación");
    console.log("📦 Payload:", payload);

    let response;

    try {
      if (task?.id) {
        response = await supabase
          .from("tasks")
          .update(payload)
          .eq("id", task.id);
      } else {
        response = await supabase.from("tasks").insert([payload]);
      }

      if (response.error) {
        console.error("❌ Error al guardar tarea:", response.error);
      } else {
        console.log("✅ Tarea guardada:", response.data);
        onSaved();
        onClose();
      }
    } catch (error) {
      console.error("❌ Excepción inesperada:", error);
    }
  };

  const handleAddSubtask = () => {
    const last = subtasks[subtasks.length - 1];

    if (last && last.title.trim() === "") {
      console.log("No se puede agregar subtarea vacía");
      return;
    }

    // Agrega una nueva subtarea
    setSubtasks((prev) => [
      ...prev,
      { id: Date.now(), title: "", status: "Pendiente" },
    ]);
  };

  const handleSubtaskChange = (index, field, value) => {
    const updated = [...subtasks];
    updated[index][field] = value;
    setSubtasks(updated);
  };

  const handleRemoveSubtask = (index) => {
    if (index === 0) return; // No se puede eliminar la primera subtarea
    const updated = [...subtasks];
    updated.splice(index, 1);
    setSubtasks(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
      <form
        onSubmit={handleSave}
        className="bg-white p-6 rounded-2xl w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-bold">
          {task ? "Editar Tarea" : "Agregar Tarea"}
        </h2>

        {/* Título */}
        <div>
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`w-full border p-2 rounded-2xl ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title}</p>
          )}
        </div>

        {/* Fechas */}
        <div className="flex gap-2">
          <div className="w-full">
            <input
              type="date"
              className={`border p-2 rounded-2xl w-full ${
                errors.startDate ? "border-red-500" : ""
              }`}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            {errors.startDate && (
              <p className="text-red-500 text-sm">{errors.startDate}</p>
            )}
          </div>
          <div className="w-full">
            <input
              type="date"
              className={`border p-2 rounded-2xl w-full ${
                errors.endDate ? "border-red-500" : ""
              }`}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {errors.endDate && (
              <p className="text-red-500 text-sm">{errors.endDate}</p>
            )}
          </div>
        </div>

        {/* Estado */}
        <div className="flex gap-2">
          {["Pendiente", "En Progreso", "Completado"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStatus(s)}
              className={`p-2 border rounded-full ${
                status === s ? "bg-[#52B788] text-white" : "bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Descripción */}
        <div>
          <h3 className="font-medium mb-2">Descripción</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full border p-2 rounded-2xl min-h-[100px] ${
              errors.description ? "border-red-500" : ""
            }`}
            placeholder="Escribe una descripción de la tarea..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description}</p>
          )}
        </div>

        {/* Subtareas */}
        <div className="mt-4">
          <h3 className="font-medium mb-2">Subtareas</h3>
          {Array.isArray(subtasks) && subtasks.length > 0 ? (
            subtasks.map((sub, i) => (
              <div key={sub.id} className="flex gap-2 items-center mb-2">
                <input
                  type="text"
                  value={sub.title}
                  onChange={(e) =>
                    handleSubtaskChange(i, "title", e.target.value)
                  }
                  className="flex-1 border p-2 rounded-2xl"
                  placeholder={`Subtarea ${i + 1}`}
                />
                <select
                  value={sub.status}
                  onChange={(e) =>
                    handleSubtaskChange(i, "status", e.target.value)
                  }
                  className="border p-2 rounded-2xl"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Progreso">En progreso</option>
                  <option value="Completado">Completado</option>
                </select>
                {i > 0 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(i)}
                    className="text-[#ef233c]"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))
          ) : (
            <p>No hay subtareas.</p>
          )}

          {/* Botón para agregar subtarea */}
          <button
            type="button"
            onClick={handleAddSubtask}
            className="mt-2 w-full py-2 text-[#52B788] cursor-pointer border border-[#52B788] rounded-full hover:bg-[#52B788] hover:text-white transition-colors duration-300"
          >
            Agregar Subtarea
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-500 bg-gray-200 rounded-full cursor-pointer hover:bg-gray-300 transition duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-[#52B788] rounded-full cursor-pointer hover:bg-[#52B788]/80 transition duration-300"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
