import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const [shouldRender, setshouldRender] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      setshouldRender(true);
    }
  }, [isAuthenticated]);
  console.log('isAuthenticated ' + isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
