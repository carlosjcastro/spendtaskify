import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { FiSave, FiTrash2 } from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  // Obtener información del usuario actual
  useEffect(() => {
    getUserInfo();
  }, []);

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/\s+/g, "_").replace(/[^\w\-_.]/g, "");
  };

  const getUserInfo = async () => {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    const currentUser = session?.user;

    if (currentUser) {
      setUser(currentUser);
      const { data, error: getError } = await supabase
        .from("profiles")
        .select("username, avatar_url")
        .eq("id", currentUser.id)
        .single();

      if (getError) {
        console.error("Error al obtener datos del perfil:", getError);
        return;
      }

      setUsername(data.username || "");
      setPreviewUrl(data.avatar_url || "");
    }
  };

  const handleGuardar = async () => {
    if (username === user.username && fotoPerfil === null) {
      setMensaje("No se realizaron cambios.");
      return;
    }

    setLoading(true);
    let fotoUrl = previewUrl;

    if (fotoPerfil) {
      if (fotoPerfil.size > 5 * 1024 * 1024) {
        setMensaje(
          "❌ El archivo es demasiado grande. El tamaño máximo permitido es 5MB."
        );
        setLoading(false);
        return;
      }

      const sanitizedFileName = sanitizeFileName(fotoPerfil.name);
      console.log("Nombre de archivo sanitizado:", sanitizedFileName);

      const filePath = `${user.id}/${Date.now()}_${sanitizedFileName}`;
      console.log("Subiendo archivo a Supabase, filePath:", filePath);

      const { data, error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, fotoPerfil);

      // Verificamos la respuesta de la subida
      if (uploadError) {
        console.error("Error al subir la imagen:", uploadError);
        setMensaje("❌ Error al subir imagen: " + uploadError.message);
        setLoading(false);
        return;
      }

      console.log("Objeto de respuesta de subida (data):", data);

      const filePathRelative = data.path;
      console.log("Path relativo de la imagen subida:", filePathRelative);

      // Construir la URL pública directamente
      const publicUrl = `https://oyxzajcawnadddsfohez.supabase.co/storage/v1/object/public/avatars/${filePathRelative}`;
      console.log("Probando URL pública directa:", publicUrl);

      // Se verifica si la URL directa funciona
      const response = await fetch(publicUrl);
      if (response.ok) {
        console.log("URL pública válida:", publicUrl);
        fotoUrl = publicUrl;
      } else {
        console.error("Error al acceder a la URL pública directamente.");
        setMensaje("❌ No se puede acceder a la URL pública.");
        setLoading(false);
        return;
      }
    }

    // Verifica que la URL de la foto se haya asignado correctamente
    if (!fotoUrl) {
      setMensaje("❌ No se ha asignado una URL de foto válida.");
      setLoading(false);
      return;
    }

    console.log("Foto URL para actualizar perfil:", fotoUrl);

    // Actualiza el perfil en la base de datos
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      avatar_url: fotoUrl,
    });

    if (error) {
      console.error("Error al actualizar el perfil:", error);
      setMensaje("❌ Error al actualizar perfil: " + error.message);
    } else {
      console.log("Perfil actualizado correctamente.");
      setMensaje("✅ Perfil actualizado correctamente.");
      setPreviewUrl(fotoUrl); // Establece la nueva URL para mostrarla en el preview
    }

    setLoading(false);
  };

  const handleDeleteAccount = () => {
    setMostrarModal(true);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0F1B24] px-4">
      <div className="max-w-full sm:max-w-4xl w-full mx-auto p-6 sm:p-8 bg-[#1A242F] text-white rounded-2xl animate-fade-in">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-center">
          Perfil de Usuario
        </h2>

        <div className="mb-6">
          <label className="block text-sm sm:text-base mb-2 font-medium">
            Correo electrónico
          </label>
          <input
            type="text"
            value={user?.email || ""}
            disabled
            className="w-full p-3 rounded-2xl bg-[#34495E] text-white cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#52B788] transition duration-300"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm sm:text-base mb-2 font-medium">
            Nombre y Apellido
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-2xl bg-[#34495E] text-white focus:outline-none focus:ring-2 focus:ring-[#52B788] transition duration-300"
          />
        </div>

        <div className="mb-6 text-center">
          <label className="block text-sm sm:text-base mb-2 font-medium">
            Foto de perfil
          </label>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full mb-4 object-cover mx-auto border-2 border-[#52B788]"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              setFotoPerfil(e.target.files[0]);
              setPreviewUrl(URL.createObjectURL(e.target.files[0]));
            }}
            className="text-white bg-[#2C3E50] p-2 rounded-2xl cursor-pointer hover:bg-[#34495E] focus:outline-none"
          />
        </div>

        {mensaje && (
          <div className="mb-6 bg-green-500 text-white p-3 rounded animate-pulse">
            {mensaje}
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleGuardar}
            disabled={loading}
            className={`px-6 py-3 rounded-full text-white transition duration-300 w-full sm:w-auto ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#52B788] hover:bg-[#40916C] focus:ring-2 focus:ring-[#52B788] cursor-pointer"
            }`}
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                <span>Guardando...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <FiSave className="h-5 w-5" />
                <span>Guardar Cambios</span>
              </span>
            )}
          </button>
          {/* 
          <button
            onClick={handleDeleteAccount}
            className="border-2 border-[#ef233c] px-6 py-3 rounded-full text-white hover:bg-[#ef233c] w-full sm:w-auto transition duration-300 cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <FiTrash2 className="h-5 w-5" />
              <span>Eliminar Cuenta</span>
            </span>
          </button> */}
        </div>
      </div>
      {/* {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1A242F] text-white rounded-lg p-6 shadow-xl max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">¿Eliminar cuenta?</h2>
            <p className="mb-6 text-sm">
              Esta acción no se puede deshacer. ¿Estás seguro de que deseas
              continuar?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setMostrarModal(false)}
                className="px-4 py-2 bg-gray-500 rounded-full hover:bg-gray-600 transition duration-300 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  const { error: deleteError } = await supabase
                    .from("profiles")
                    .delete()
                    .eq("id", user.id);
                  if (deleteError) {
                    console.error("Error al eliminar cuenta:", deleteError);
                    setMensaje(
                      "❌ Error al eliminar cuenta: " + deleteError.message
                    );
                    setMostrarModal(false);
                    return;
                  }
                  await supabase.auth.signOut();
                  setMensaje("✅ Cuenta eliminada y sesión cerrada.");
                  setMostrarModal(false);
                }}
                className="px-4 py-2 bg-[#ef233c] rounded-full transition duration-300 cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
}
