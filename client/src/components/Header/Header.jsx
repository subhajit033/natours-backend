import { Link } from 'react-router-dom';
import { logoWhite } from '../../assets/image';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authentication } from '../../redux/authSlice';
import { loadUserDetails } from '../../redux/userDetails';
import { api_url } from '../../utils/helper';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const userData = useSelector((store) => store.user.userData);
  console.log('isAuth in header ' + isAuthenticated);
  const handleLogOut = async () => {
    try {
      const response = await axios.get('/api/v1/users/logout', {withCredentials: true});
      if (response?.data?.status === 'success') {
        navigate('/');
        dispatch(authentication(false));
        dispatch(loadUserDetails(null));
        toast('Logout Sucessfully !', {
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
        throw new Error('Logout failed');
      }
    } catch (err) {
      toast.error('Logout Failed! try again', {
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
    <header className='header'>
      <ToastContainer />
      <nav className='nav nav--tours'>
        <Link className='nav__el' href='/'>
          All tours
        </Link>
      </nav>
      <div className='header__logo'>
        <img src={logoWhite} alt='Natours logo' />
      </div>
      <nav className='nav nav--user'>
        {isAuthenticated ? (
          <>
            <button onClick={handleLogOut} className='nav__el nav__el--logout'>
              Log out
            </button>
            <Link className='nav__el' to='/me'>
              <img
                className='nav__user-img'
                src={
                  userData?.photo
                    ? userData?.photo
                    : 'https://icon-library.com/images/icon-user/icon-user-15.jpg'
                }
                alt='Photo of user'
              />
              <span>{userData?.name.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Link to='/login' className='nav__el'>
              Log in
            </Link>
            <Link to='/signup' className='nav__el nav__el--cta'>
              Sign up{' '}
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
