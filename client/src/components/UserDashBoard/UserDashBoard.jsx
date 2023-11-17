import DashBoardNavigation from './DashBoardNavigation';
// import UserDetails from './UserDetails';
import { Outlet } from 'react-router-dom';
const UserDashBoard = () => {
  return (
    <main className='main'>
      <div className='user-view'>
        <DashBoardNavigation />
        <Outlet />
      </div>
    </main>
  );
};

export default UserDashBoard;
