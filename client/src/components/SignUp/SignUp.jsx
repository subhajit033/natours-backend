import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { api_url } from '../../utils/helper';
import { useNavigate } from 'react-router-dom';
import { authentication } from '../../redux/authSlice';
import { loadUserDetails } from '../../redux/userDetails';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios({
        method: 'post',
        withCredentials: true,
        url: '/api/v1/users/signup',
        data: { name, email, password, passwordconfirm: passwordConfirm },
      });
      if (response?.data?.status === 'success') {
        dispatch(authentication(true));
        dispatch(loadUserDetails(response?.data?.data?.user));
        navigate('/');
        toast.success(`${name.split(' ')[0]} welcome to Natours`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } else {
        throw new Error('Signup failed');
      }
    } catch (err) {
      console.log(err);
      toast.error('Signup failed', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
      dispatch(authentication(false));
      dispatch(loadUserDetails(null));
    }
  };
  return (
    <main className='main'>
      <ToastContainer />
      <div className='login-form'>
        <h2 className='heading-secondary ma-bt-lg'>Create a new account</h2>
        <form onSubmit={handleSubmit} className='form'>
          <div className='form__group'>
            <label className='form__label' htmlFor='name'>
              Your Name
            </label>
            <input
              className='form__input'
              id='name'
              type='text'
              placeholder='Your Name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
          <div className='form__group ma-bt-md'>
            <label className='form__label' htmlFor='passwordConfirm'>
              Password Confirm
            </label>
            <input
              className='form__input'
              id='passwordConfirm'
              type='password'
              placeholder='••••••••'
              required
              minLength='8'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div className='form__group'>
            <button className='btn btn--green'>Submit</button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default SignUp;
