import React, { useState, useEffect } from "react";
import {
  FiPlus,
  FiDollarSign,
  FiTag,
  FiCalendar,
  FiCheck,
  FiX,
  FiSave,
} from "react-icons/fi";
import { FaRegEdit } from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { supabase } from "../../supabaseClient";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export default function Finances() {
  const [transacciones, setTransacciones] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoTransaccion, setTipoTransaccion] = useState("ingreso");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [mensajeError, setMensajeError] = useState("");
  const [user, setUser] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [transaccionEditando, setTransaccionEditando] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch transactions from Supabase
  const fetchTransactions = async () => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    const currentUser = data?.session?.user;

    if (sessionError || !currentUser) {
      console.error("Error fetching session:", sessionError);
      setMensajeError(
        "Hubo un problema con la sesión. Por favor, inicia sesión."
      );
      return;
    }

    setUser(currentUser);

    const { data: transaccionesData, error } = await supabase
      .from("transacciones")
      .select("*")
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error fetching transactions:", error);
      setMensajeError("Error al cargar las transacciones");
    } else {
      setTransacciones(transaccionesData);
    }
  };

  // Guardar o editar una transacción
  const handleGuardarTransaccion = async () => {
    if (!descripcion || !monto || !fecha || !categoria) {
      setMensajeError("Por favor, completa todos los campos.");
      return;
    }

    const { data, error: sessionError } = await supabase.auth.getSession();
    const currentUser = data?.session?.user;

    if (sessionError || !currentUser) {
      console.error("Error obteniendo sesión:", sessionError);
      setMensajeError(
        "Hubo un problema con la sesión. Por favor, inicia sesión."
      );
      return;
    }

    const transaccionData = {
      tipo: tipoTransaccion,
      descripcion,
      monto: parseFloat(monto.replace(/,/g, "")),
      fecha,
      categoria,
      user_id: currentUser.id,
    };

    if (modoEdicion && transaccionEditando) {
      const { data: updated, error } = await supabase
        .from("transacciones")
        .update(transaccionData)
        .eq("id", transaccionEditando.id)
        .eq("user_id", currentUser.id)
        .select();

      if (error) {
        console.error("Error al editar transacción:", error);
        setMensajeError("Error al editar la transacción");
      } else {
        const nuevasTransacciones = transacciones.map((t) =>
          t.id === transaccionEditando.id ? updated[0] : t
        );
        setTransacciones(nuevasTransacciones);
      }
    } else {
      const { data: inserted, error } = await supabase
        .from("transacciones")
        .insert([transaccionData])
        .select();

      if (error) {
        console.error("Error al insertar transacción:", error);
        setMensajeError("Error al agregar la transacción");
      } else {
        setTransacciones([...transacciones, inserted[0]]);
      }
    }

    setIsModalOpen(false);
    setDescripcion("");
    setMonto("");
    setCategoria("");
    setFecha("");
    setMensajeError("");
    setModoEdicion(false);
    setTransaccionEditando(null);
  };

  // Función para iniciar la edición de una transacción
  const iniciarEdicion = (transaccion) => {
    setDescripcion(transaccion.descripcion);
    setMonto(transaccion.monto.toString());
    setCategoria(transaccion.categoria);
    setFecha(transaccion.fecha);
    setTipoTransaccion(transaccion.tipo);
    setModoEdicion(true);
    setTransaccionEditando(transaccion);
    setIsModalOpen(true);
  };

  // Función para eliminar una transacción
  const handleDeleteTransaction = async (id) => {
    const { data, error: sessionError } = await supabase.auth.getSession();
    const currentUser = data?.session?.user;

    if (sessionError || !currentUser) {
      console.error("Error obteniendo sesión:", sessionError);
      setMensajeError("No se pudo verificar la sesión.");
      return;
    }

    const { error } = await supabase
      .from("transacciones")
      .delete()
      .eq("id", id)
      .eq("user_id", currentUser.id);

    if (error) {
      console.error("Error al eliminar transacción:", error);
      setMensajeError("No se pudo eliminar la transacción.");
    } else {
      setTransacciones(transacciones.filter((t) => t.id !== id));
    }
  };

  // Formatear el número con separador de miles y decimales
  const formatNumber = (num) => num.toLocaleString("es-AR");

  // Filtrar transacciones según los filtros aplicados
  const filteredTransacciones = transacciones
    .filter((t) => {
      if (!t.fecha) return false;

      const [anioStr, mesStr] = t.fecha.split("-");
      const mes = parseInt(mesStr);
      const anio = parseInt(anioStr);

      return (
        (filtroMes ? mes === parseInt(filtroMes) : true) &&
        (filtroAnio ? anio === parseInt(filtroAnio) : true) &&
        (filtroTipo ? t.tipo === filtroTipo : true)
      );
    })
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

  // Formatear la fecha a un formato legible
  const formatearFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split("-");
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    ).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Generación del informe PDF
  const generarInformePDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const transaccionesParaInforme = filteredTransacciones.map((t) => ({
      Fecha: formatearFecha(t.fecha),
      Descripción: t.descripcion,
      Monto: `$${formatNumber(t.monto)}`,
      Tipo: t.tipo === "ingreso" ? "Ingreso" : "Gasto",
    }));

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Informe Financiero", 14, 20);

    const tableColumnStyle = {
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: 255,
        fontSize: 12,
        font: "helvetica",
        halign: "center",
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 5,
        valign: "middle",
        halign: "left",
      },
      margin: { top: 30, bottom: 20 },
      startY: 30,
      theme: "striped",
      head: [["Fecha", "Descripción", "Monto", "Tipo"]],
      body: transaccionesParaInforme.map((t) => [
        t.Fecha,
        t.Descripción,
        t.Monto,
        t.Tipo,
      ]),
    };

    // Generación de la tabla
    doc.autoTable(tableColumnStyle);

    // Ajuste de la página si el contenido excede el tamaño de la página
    const pageHeight = doc.internal.pageSize.height;
    const yPosition = doc.lastAutoTable.finalY || 30;
    if (yPosition > pageHeight - 30) {
      doc.addPage(); // Si el contenido excede, se agrega una nueva página
      doc.autoTable(tableColumnStyle); // Se vuelve a dibujar la tabla en la nueva página
    }

    // Generar el archivo PDF
    doc.save("informe_financiero.pdf");
  };

  return (
    <div className="bg-[#0d1b2a] text-white px-6 py-8 min-h-screen">
      <h2 className="text-white text-3xl font-bold mb-4">
        Mi Resumen Financiero
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#52B788] p-4 rounded-2xl text-center">
          <h4 className="text-lg font-semibold">Ingresos</h4>
          <p className="text-2xl">{`$${formatNumber(
            filteredTransacciones
              .filter((t) => t.tipo === "ingreso")
              .reduce((sum, t) => sum + t.monto, 0)
          )}`}</p>
        </div>
        <div className="bg-[#ef233c] p-4 rounded-2xl text-center">
          <h4 className="text-lg font-semibold">Gastos</h4>
          <p className="text-2xl">{`$${formatNumber(
            filteredTransacciones
              .filter((t) => t.tipo === "gasto")
              .reduce((sum, t) => sum + t.monto, 0)
          )}`}</p>
        </div>
        <div className="bg-[#64748B] p-4 rounded-2xl text-center">
          <h4 className="text-lg font-semibold">Balance</h4>
          <p className="text-2xl">{`$${formatNumber(
            filteredTransacciones
              .filter((t) => t.tipo === "ingreso")
              .reduce((sum, t) => sum + t.monto, 0) -
              filteredTransacciones
                .filter((t) => t.tipo === "gasto")
                .reduce((sum, t) => sum + t.monto, 0)
          )}`}</p>
        </div>
      </div>

      {/* Filtros por fecha y tipo */}
      <div className="mb-6 bg-[#1A242F] p-4 rounded-2xl">
        <h4 className="text-lg font-semibold mb-3">Filtrar por Fecha</h4>
        <div className="flex flex-col sm:flex-row sm:justify-between mb-4">
          <div className="sm:w-1/2 sm:pr-2 w-full mb-4 sm:mb-0">
            <label htmlFor="filtroMes" className="block text-sm mb-1">
              Mes
            </label>
            <div className="relative">
              <select
                id="filtroMes"
                className="w-full p-2 pl-10 pr-3 rounded-2xl bg-[#34495E] text-white"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
              >
                <option value="">Todos los Meses</option>
                <option value="1">Enero</option>
                <option value="2">Febrero</option>
                <option value="3">Marzo</option>
                <option value="4">Abril</option>
                <option value="5">Mayo</option>
                <option value="6">Junio</option>
                <option value="7">Julio</option>
                <option value="8">Agosto</option>
                <option value="9">Septiembre</option>
                <option value="10">Octubre</option>
                <option value="11">Noviembre</option>
                <option value="12">Diciembre</option>
              </select>
              <FiCalendar className="absolute top-2 left-2" />
            </div>
          </div>

          <div className="sm:w-1/2 sm:pl-2 w-full">
            <label htmlFor="filtroAnio" className="block text-sm mb-1">
              Año
            </label>
            <div className="relative">
              <select
                id="filtroAnio"
                className="w-full p-2 pl-10 pr-3 rounded-2xl bg-[#34495E] text-white"
                value={filtroAnio}
                onChange={(e) => setFiltroAnio(e.target.value)}
              >
                <option value="">Todos los Años</option>
                {Array.from(
                  { length: new Date().getFullYear() - 2000 + 1 },
                  (_, i) => 2000 + i
                )
                  .reverse()
                  .map((anio) => (
                    <option key={anio} value={anio}>
                      {anio}
                    </option>
                  ))}
              </select>
              <FiCalendar className="absolute top-2 left-2" />
            </div>
          </div>
        </div>

        <h4 className="text-lg font-semibold mb-3">Filtrar por Tipo</h4>
        <div className="flex space-x-4 flex-wrap">
          <button
            className={`p-2 rounded-full text-white cursor-pointer ${
              filtroTipo === "" ? "bg-[#34495E]" : "bg-[#2C3E50]"
            }`}
            onClick={() => setFiltroTipo("")}
          >
            Todos
          </button>
          <button
            className={`p-2 rounded-full text-white cursor-pointer ${
              filtroTipo === "ingreso" ? "bg-[#52B788]" : "bg-[#34495E]"
            }`}
            onClick={() => setFiltroTipo("ingreso")}
          >
            Ingresos
          </button>
          <button
            className={`p-2 rounded-full text-white cursor-pointer ${
              filtroTipo === "gasto" ? "bg-[#FFB4A2]" : "bg-[#34495E]"
            }`}
            onClick={() => setFiltroTipo("gasto")}
          >
            Gastos
          </button>
        </div>
        <div className="mb-6 flex justify-end">
          <button
            className="bg-[#52B788] px-6 py-2 rounded-full text-white cursor-pointer hover:bg-[#2C3E50] transition-colors duration-300 flex items-center gap-2"
            onClick={generarInformePDF}
          >
            <FaRegFilePdf /> Generar Informe PDF
          </button>
        </div>
      </div>

      {/* Botones para agregar ingresos y gastos */}
      <div className="flex flex-wrap justify-between mb-6 space-y-4 sm:space-y-0">
        <button
          className="bg-[#52B788] flex items-center px-4 py-2 rounded-full text-white cursor-pointer hover:bg-[#2C3E50] transition-colors duration-300"
          onClick={() => {
            setTipoTransaccion("ingreso");
            setIsModalOpen(true);
          }}
        >
          <FiPlus className="mr-2" />
          Agregar Ingreso
        </button>
        <button
          className="bg-[#FFB4A2] flex items-center px-4 py-2 rounded-full text-white cursor-pointer hover:bg-[#2C3E50] transition-colors duration-300"
          onClick={() => {
            setTipoTransaccion("gasto");
            setIsModalOpen(true);
          }}
        >
          <FiPlus className="mr-2" />
          Agregar Gasto
        </button>
      </div>

      <h3 className="text-2xl font-bold mt-6 mb-2">Transacciones filtradas</h3>
      <ul className="space-y-2">
        {filteredTransacciones.length > 0 ? (
          filteredTransacciones.map((t) => (
            <li
              key={t.id}
              className="text-[#ffffff] border-b border-gray-600 py-2 flex justify-between items-center"
            >
              <div>
                <span className="font-semibold">{t.tipo.toUpperCase()}</span>:{" "}
                {t.descripcion} - ${formatNumber(t.monto)}{" "}
                <span className="text-sm text-[#ffffff]">({t.fecha})</span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-blue-400 hover:text-blue-600"
                  onClick={() => iniciarEdicion(t)}
                >
                  <FaRegEdit />
                </button>
                <button
                  className="text-[#ef233c] hover:text-red-600"
                  onClick={() => handleDeleteTransaction(t.id)}
                >
                  <MdDeleteOutline size={20} />
                </button>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-600">No hay transacciones para mostrar.</li>
        )}
      </ul>

      {/* Modal para agregar/editar transacciones */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#ffffff] p-6 rounded-2xl w-full max-w-md mx-4 sm:w-3/4 md:w-96 lg:w-1/3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mensaje de error */}
            {mensajeError && (
              <div className="text-[#ef233c] text-center py-2 mb-4 rounded-2xl">
                {mensajeError}
              </div>
            )}

            <h2 className="text-[#000000] text-xl font-semibold mb-4">
              {modoEdicion ? "Editar Transacción" : "Agregar Transacción"}
            </h2>

            {/* Descripción */}
            <div className="mb-4">
              <label className="text-[#000000] block text-sm mb-2">
                Descripción
              </label>
              <input
                type="text"
                className="border w-full p-2 rounded-2xl text-[#000000]"
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>

            {/* Monto */}
            <div className="mb-4">
              <label className="text-[#000000] block text-sm mb-2">Monto</label>
              <input
                type="text"
                className="border w-full p-2 rounded-2xl text-[#000000]"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
              />
            </div>

            {/* Categoría */}
            <div className="mb-4">
              <label className="text-[#000000] block text-sm mb-2">
                Categoría
              </label>
              <select
                className="border w-full p-2 rounded-2xl text-[#000000]"
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
              >
                <option value="">Seleccioná una categoría</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Transporte">Transporte</option>
                <option value="Salud">Salud</option>
                <option value="Entretenimiento">Entretenimiento</option>
                <option value="Educación">Educación</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            {/* Fecha */}
            <div className="mb-4">
              <label className="text-[#000000] block text-sm mb-2">Fecha</label>
              <input
                type="date"
                className="border w-full p-2 rounded-2xl text-[#000000]"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
              />
            </div>

            <div className="flex justify-between">
              <button
                className="text-gray-500 bg-gray-200 px-4 py-2 rounded-full flex items-center cursor-pointer hover:bg-gray-300 transition duration-300"
                onClick={() => setIsModalOpen(false)}
              >
                <FiX className="mr-2" />
                Cancelar
              </button>
              <button
                className="text-white bg-[#52B788] px-4 py-2 rounded-full flex items-center cursor-pointer hover:bg-[#52B788]/80 transition duration-300"
                onClick={handleGuardarTransaccion}
              >
                <FiSave className="mr-2" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
