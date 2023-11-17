import { useState } from 'react';
import axios from 'axios';
import { api_url } from '../../utils/helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { authentication } from '../../redux/authSlice';
import { loadUserDetails } from '../../redux/userDetails';
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        withCredentials: true,
        url: '/api/v1/users/login',
        data: { email, password },
      });
      dispatch(authentication(true));
      dispatch(loadUserDetails(response?.data?.data?.user));
      navigate('/');
      console.log(response);
      toast('Login Sucessfull', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    } catch (err) {
      console.log(err);
      dispatch(authentication(false));
      toast.error(err?.response?.data?.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <main className='main'>
      <ToastContainer />
      <div className='login-form'>
        <h2 className='heading-secondary ma-bt-lg'>Log into your account</h2>
        <form onSubmit={handleSubmit} className='form'>
          <div className='form__group'>
            <label className='form__label' htmlFor='email'>
              Email address
            </label>
            <input
              className='form__input'
              id='email'
              type='email'
              placeholder='you@example.com'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className='form__group ma-bt-md'>
            <label className='form__label' htmlFor='password'>
              Password
            </label>
            <input
              className='form__input'
              id='password'
              type='password'
              placeholder='••••••••'
              required
              minLength='8'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='form__group'>
            <button className='btn btn--green'>Login</button>
            <Link style={{fontSize: '1.3rem', marginLeft: '2rem'}} to='/signup'>New to Natours ? create a new account</Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
