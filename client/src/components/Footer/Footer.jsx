import React from 'react';
import { logoGreen } from '../../assets/image';
const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer__logo'>
        <img src={logoGreen} alt='Natour logo' />
      </div>
      <ul className='footer__nav'>
        <li>
          <a href='#'>About us</a>
        </li>
        <li>
          <a href='#'>Download apps</a>
        </li>
        <li>
          <a href='#'>Become a guide</a>
        </li>
        <li>
          <a href='#'>Careers</a>
        </li>
        <li>
          <a href='#'>Contact</a>
        </li>
      </ul>
      <p className='footer__copyright'>&copy; Natours 2023</p>
    </footer>
  );
};

export default Footer;
