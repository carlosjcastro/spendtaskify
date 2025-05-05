import React from 'react';
import { Link } from 'react-router-dom';
import TaskCard from '../../components/dashboard/task-card/TaskCard';
import FinanceCard from '../../components/dashboard/finance-card/FinanceCard';
import DashboardFooter from '../../components/dashboard/dashboard-footer/DashboardFooter';

export default function Dashboard() {
  return (
    <div className="bg-[#0d1b2a] text-white min-h-screen flex flex-col justify-between px-4 py-8">
      <div className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl text-center">
          <h1 className="text-3xl font-semibold mb-4">Bienvenido a tu Dashboard</h1>
          <p className="mb-8">
            Aquí puedes gestionar tus finanzas personales y llevar un registro de tus tareas pendientes.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FinanceCard />
            <TaskCard />
          </div>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
}
