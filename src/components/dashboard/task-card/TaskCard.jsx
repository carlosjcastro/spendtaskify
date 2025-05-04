import React from 'react';
import { Link } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';

export default function TaskCard() {
  return (
    <div className="border-2 border-[#52B788] hover:bg-[#52B788] p-6 rounded-2xl text-center transition duration-300 ease-in-out">
      <FaTasks className="text-4xl mb-4 mx-auto" />
      <h2 className="text-xl font-semibold mb-2">Mis Tareas</h2>
      <p className="mb-4">Gestioná tus tareas pendientes y completadas.</p>
      <Link to="/dashboard/tasks/" className="bg-white text-blue-600 py-2 px-4 rounded-full">
        Ir a Tareas
      </Link>
    </div>
  );
}
