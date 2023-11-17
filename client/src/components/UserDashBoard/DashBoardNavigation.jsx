import { iconsSvg } from '../../assets/image';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
const DashBoardNavigation = () => {
  const user = useSelector((store) => store.user.userData);
  return (
    <nav className='user-view__menu'>
      <ul className='side-nav'>
        <li className='side-nav--active'>
          <Link to='/me'>
            <svg>
              <use xlinkHref={`${iconsSvg}#icon-setting`} />
            </svg>
            Settings
          </Link>
        </li>
        <li>
          <Link to='/me/my-tours'>
            <svg>
              <use xlinkHref={`${iconsSvg}#icon-briefcase`} />
            </svg>
            My bookings
          </Link>
        </li>
        <li>
          <a href='#'>
            <svg>
              <use xlinkHref={`${iconsSvg}#icon-star`} />
            </svg>
            My reviews
          </a>
        </li>
        <li>
          <a href='#'>
            <svg>
              <use xlinkHref={`${iconsSvg}#icon-credit-card`} />
            </svg>
            Billing
          </a>
        </li>
      </ul>
      {user.role === 'admin' && (
        <div className='admin-nav'>
          <h5 className='admin-nav__heading'>Admin</h5>
          <ul className='side-nav'>
            <li>
              <a href='#'>
                <svg>
                  <use xlinkHref={`${iconsSvg}#icon-map`} />
                </svg>
                Manage tours
              </a>
            </li>
            <li>
              <a href='#'>
                <svg>
                  <use xlinkHref={`${iconsSvg}#icon-users`} />
                </svg>
                Manage users
              </a>
            </li>
            <li>
              <a href='#'>
                <svg>
                  <use xlinkHref={`${iconsSvg}#icon-star`} />
                </svg>
                Manage reviews
              </a>
            </li>
            <li>
              <a href='#'>
                <svg>
                  <use xlinkHref={`${iconsSvg}#icon-briefcase`} />
                </svg>
                Manage Booking
              </a>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default DashBoardNavigation;
