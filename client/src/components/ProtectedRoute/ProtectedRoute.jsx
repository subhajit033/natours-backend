
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../Loader/Loader';
const ProtectedRoute = () => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  if (isAuthenticated === null) {
    return <Loader />;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoute;
