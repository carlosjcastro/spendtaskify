import React from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../../components/dashboard/task-card/TaskCard';
import FinanceCard from '../../components/dashboard/finance-card/FinanceCard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-semibold mb-4">Bienvenido a tu Dashboard</h1>
      <p className="text-center mb-8">
        Aquí puedes gestionar tus finanzas personales y llevar un registro de tus tareas pendientes.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FinanceCard />
        <TaskCard />
      </div>
    </div>
  );
}
