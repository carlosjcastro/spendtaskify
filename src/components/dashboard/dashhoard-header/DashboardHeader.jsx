import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";

const DashboardHeader = () => {
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

          setAvatarUrl(data?.avatar_url || "https://via.placeholder.com/40");
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
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {/* Botón hamburguesa en mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-2xl focus:outline-none"
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        {/* Contenido Desktop */}
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

              {/* Dropdown Desktop */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute top-12 right-0 bg-[#1a2a3a] shadow-lg rounded-md w-44 py-2 animate-fade-in z-50"
                >
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center px-4 py-2 hover:bg-[#223344] transition duration-300"
                  >
                    <FiUser className="mr-2" />
                    Cuenta
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex text-[#FFB4A2] items-center w-full px-4 py-2 hover:bg-[#223344] transition duration-300 text-left cursor-pointer"
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

      {/* Menú Mobile con animación clip-path */}
      <div
        className={`md:hidden transition-all duration-500 ease-in-out ${
          menuOpen
            ? "clip-open opacity-100 translate-y-0"
            : "clip-close opacity-0 -translate-y-2 pointer-events-none"
        } bg-[#142533] mt-3 rounded-lg overflow-hidden shadow-md`}
      >
        {user && (
          <>
            <button
              onClick={() => {
                setMenuOpen(false);
                navigate("/dashboard/profile");
              }}
              className="flex items-center w-full px-4 py-2 hover:bg-[#223344] transition duration-300"
            >
              <FiUser className="mr-2" />
              Cuenta
            </button>
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="flex text-[#FFB4A2] w-full items-center px-4 py-2 hover:bg-[#223344] transition duration-300 text-left"
            >
              <FiLogOut className="mr-2" />
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
