import React from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyCheckAlt } from 'react-icons/fa';

export default function FinanceCard() {
  return (
    <div className="border-2 border-[#52B788] hover:bg-[#52B788] p-6 rounded-2xl text-center transition duration-300 ease-in-out">
      <FaMoneyCheckAlt className="text-4xl mb-4 mx-auto" />
      <h2 className="text-xl font-semibold mb-2">Registrar Gastos/Ingresos</h2>
      <p className="mb-4">Añade tus transacciones para llevar un control efectivo.</p>
      <Link to="/dashboard/finances/" className="bg-white text-green-600 py-2 px-4 rounded-full">
        Ir a Finanzas
      </Link>
    </div>
  );
}
