import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('customers')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      } 
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return isAdmin ? <Outlet /> : <Navigate to="/admin/login" />;
};

export default AdminRoute;
