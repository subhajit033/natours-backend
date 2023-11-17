import Login from './components/Login/Login';
import SignUp from './components/SignUp/SignUp';
import { useEffect } from 'react';
import OverView from './components/Overview/OverView';
import TourDetails from './components/TourDetails/TourDetails';
import UserDetails from './components/UserDashBoard/UserDetails';
import UserDashBoard from './components/UserDashBoard/UserDashBoard';
import Booking from './components/Booking/Booking';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout/Layout';
import axios from 'axios';
import { api_url } from './utils/helper';
import { useDispatch } from 'react-redux';
import { authentication } from './redux/authSlice';
import { loadUserDetails } from './redux/userDetails';

const App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    isUserLoggedIn();
  }, []);
  const isUserLoggedIn = async () => {
    try {
      const response = await axios.get('/api/v1/users/rememberMe', {withCredentials: true});
      if (response?.data?.status === 'success') {
        dispatch(authentication(true));
        dispatch(loadUserDetails(response?.data?.data?.user));
      } else {
        throw new Error('Please Login Into the Website');
      }
    } catch (err) {
      dispatch(authentication(false));
    }
  };
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <OverView />,
      },
      // {
      //   path: '/tour/:tourId',
      //   element: <ProtectedRoute />,
      //   children: [
      //     {
      //       path: '/tour/:tourId/',
      //       element: <TourDetails />
      //     }
      //   ]
      // },
      {
        path: '/:tourName',
        element: <TourDetails />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/me',
        element: <ProtectedRoute />,
        children: [
          {
            path: '',
            element: <UserDashBoard />,
            children: [
              {
                path: '',
                element: <UserDetails />,
              },
              {
                path: 'my-tours',
                element: <Booking />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default App;
