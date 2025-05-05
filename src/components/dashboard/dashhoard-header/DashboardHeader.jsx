import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { FiUser, FiLogOut } from "react-icons/fi";

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // Detectar redimensionamiento de pantalla para cerrar el menú móvil en desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Obtener usuario y avatar
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        } else {
          const { data } = await supabase
            .from("profiles")
            .select("avatar_url")
            .eq("id", user.id)
            .single();
          setAvatarUrl(data?.avatar_url || "/src/assets/img/happy.png");
        }
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-[#0d1b2a] text-white px-4 py-3 relative z-50">
      <div className="flex justify-between items-center">
        <Link to="/dashboard">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </Link>

        {/* Botón hamburguesa */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-base font-semibold px-4 py-2 bg-[#223344] rounded-md shadow-sm hover:bg-[#2c3e50] transition duration-300 cursor-pointer"
        >
          {menuOpen ? "Cerrar ✖" : "Menú ☰"}
        </button>

        {/* Usuario (desktop) */}
        {user && (
          <div className="hidden md:flex items-center space-x-4 ml-6 mr-6">
            <div className="relative">
              <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <span className="text-sm hover:underline">{user.email}</span>
                <img
                  src={`${avatarUrl}?t=${new Date().getTime()}`}
                  alt="Perfil"
                  className="w-10 h-10 rounded-full border-2 border-[#52B788]"
                />
              </div>

              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-0 bg-[#1a2a3a] shadow-lg rounded-md w-44 py-2 animate-fade-in z-50"
                >
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 hover:bg-[#223344] transition"
                  >
                    <FiUser className="mr-2" />
                    Cuenta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex text-[#FFB4A2] items-center w-full px-4 py-2 hover:bg-[#223344] transition text-left cursor-pointer"
                  >
                    <FiLogOut className="mr-2" />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Menú móvil */}
      {menuOpen && user && (
        <div className="fixed inset-0 bg-[#0d1b2a]/90 backdrop-blur-sm z-40 flex flex-col items-center justify-center space-y-8 transition-all duration-500 animate-slide-in">
          {/* Botón de cierre */}
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-4 right-4 text-2xl text-white"
          >
            ✖
          </button>

          <button
            onClick={() => {
              setMenuOpen(false);
              navigate("/dashboard/profile");
            }}
            className="flex items-center text-xl px-6 py-4 rounded-md hover:bg-[#223344] transition"
          >
            <FiUser className="mr-2" />
            Cuenta
          </button>
          <button
            onClick={() => {
              setMenuOpen(false);
              handleLogout();
            }}
            className="flex items-center text-xl px-6 py-4 rounded-md text-[#FFB4A2] hover:bg-[#223344] transition"
          >
            <FiLogOut className="mr-2" />
            Cerrar sesión
          </button>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
