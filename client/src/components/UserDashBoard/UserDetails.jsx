import axios from 'axios';
import { api_url } from '../../utils/helper';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { loadUserDetails } from '../../redux/userDetails';
const UserDetails = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [file, setFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const userData = useSelector((store) => store.user.userData);
  useEffect(() => {
    if (userData) {
      setName(userData?.name);
      setEmail(userData?.email);
    }
  }, [userData]);
  const avatar = document.getElementById('user-avatar');

  useEffect(() => {
    if (file) {
      
      const reader = new FileReader();
      reader.onload = (e) => {
        
        avatar.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }, [file]);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    //we have to do this to handle the file
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    if (file) {
      formData.append('photo', file);
    }
    try {
      const response = await axios({
        method: 'patch',
        url: `/api/v1/users/updateMe`,
        data: formData,
        withCredentials: true, // Set at the top level
      });

      if (response.data.status === 'success') {
        dispatch(loadUserDetails(response?.data?.data?.user));
        toast.success('User details updated successfully', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
        setLoading(false);
      } else {
        throw new Error('failer');
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error('Failed to update user data', {
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

  const handlePasswordChange = async (e) => {
    setLoading(true);
    e.preventDefault();
    //here in case of password change we are generating new token , so don't need the logout the user and login again
    try {
      const response = await axios({
        method: 'patch',
        withCredentials: true,
        url: '/api/v1/users/updatePassword',
        data: { currentPassword, password, passwordConfirm },
      });

      if (response.data.status === 'success') {
        setLoading(false);
        dispatch(loadUserDetails(response?.data?.data?.user));
        setCurrentPassword('');
        setPassword('');
        setPasswordConfirm('');
        toast.success('Password updated successfully', {
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
        throw new Error('failer');
      }
    } catch (err) {
      setLoading(false);

      toast.error(err.response.data.message, {
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

  return !userData ? (
    <h1>Loading user details..</h1>
  ) : (
    <div className='user-view__content'>
      <ToastContainer />
      <div className='user-view__form-container'>
        <h2 className='heading-secondary ma-bt-md'>Your account settings</h2>
        <form onSubmit={handleSubmit} className='form form-user-data'>
          <div className='form__group'>
            <label className='form__label' htmlFor='name'>
              Name
            </label>
            <input
              className='form__input'
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              required='required'
            />
          </div>
          <div className='form__group ma-bt-md'>
            <label className='form__label' htmlFor='email'>
              Email address
            </label>
            <input
              className='form__input'
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required='required'
            />
          </div>
          <div className='form__group form__photo-upload'>
            <img
              id='user-avatar'
              className='form__user-photo'
              src={
                userData?.photo
                  ? userData?.photo
                  : 'https://icon-library.com/images/icon-user/icon-user-15.jpg'
              }
              alt='User photo'
            />
            <input
              className='form__upload'
              type='file'
              accept='image/'
              name='image'
              id='photo'
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor='photo'>Choose new photo</label>
          </div>
          <div className='form__group right'>
            <button className='btn btn--small btn--green'>
              {loading ? 'Updating..' : 'Save settings'}
            </button>
          </div>
        </form>
      </div>
      <div className='line'>&nbsp;</div>
      <div className='user-view__form-container'>
        <h2 className='heading-secondary ma-bt-md'>Password change</h2>
        <form
          onSubmit={handlePasswordChange}
          className='form form-user-settings'
        >
          <div className='form__group'>
            <label className='form__label' htmlFor='password-current'>
              Current password
            </label>
            <input
              className='form__input'
              id='password-current'
              type='password'
              placeholder='••••••••'
              required='required'
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              minLength='8'
            />
          </div>
          <div className='form__group'>
            <label className='form__label' htmlFor='password'>
              New password
            </label>
            <input
              className='form__input'
              id='password'
              type='password'
              placeholder='••••••••'
              required='required'
              minLength='8'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='form__group ma-bt-lg'>
            <label className='form__label' htmlFor='password-confirm'>
              Confirm password
            </label>
            <input
              className='form__input'
              id='password-confirm'
              type='password'
              placeholder='••••••••'
              required='required'
              minLength='8'
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>
          <div className='form__group right'>
            <button className='btn btn--small btn--green'>
              {loading ? 'Updating Password..' : 'Save password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserDetails;
