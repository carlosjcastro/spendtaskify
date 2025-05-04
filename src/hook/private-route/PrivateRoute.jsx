import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import React from 'react'; 

export default function PrivateRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setIsAuthenticated(!!session);
    };

    getSession();
  }, []);

  if (isAuthenticated === null) return <div className="text-white">Loading...</div>;

  return isAuthenticated ? children : <Navigate to="/login" />;
}
