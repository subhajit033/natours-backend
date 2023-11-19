import { useState } from 'react';
import { logoWhite } from '../../assets/image';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { api_url } from '../../utils/helper';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const TourBuy = ({ images, duration, tourSlug }) => {
  const isAuthenticated = useSelector((store) => store.auth.isAuthenticated);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const bookTour = async () => {
    try {
      setLoading(true);
      const stripe = await loadStripe(
        'pk_test_51OBHZtSI41yQ1g5YyAiPqlyx0tDza2PH2MUt0JKIXH5EKoLquT1hxPy8FaD8emO3N2basTfcVf6brHUt5oeTbhxs00CxtqumXH'
      );
      const session = await axios.get(
        `/api/v1/bookings/checkout-session/${tourSlug}`, {withCredentials: true}
      );

      await stripe.redirectToCheckout({
        sessionId: session.session.id,
      });
      
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  console.log('Loading ' + loading);
  return (
    <section className='section-cta'>
      <ToastContainer />
      <div className='cta'>
        <div className='cta__img cta__img--logo'>
          <img src={logoWhite} alt='Natours logo' className='' />
        </div>
        <img
          src={images[1]}
          alt='tour-images'
          className='cta__img cta__img--1'
        />
        <img
          src={images[2]}
          alt='tour-images'
          className='cta__img cta__img--2'
        />

        <div className='cta__content'>
          <h2 className='heading-secondary'>What are you waiting for?</h2>
          <p className='cta__text'>
            {`${duration} days. 1 adventure. Infinite memories. Make it yours today!`}
          </p>
          {isAuthenticated ? (
            <button onClick={bookTour} className='btn btn--green span-all-rows'>
              {loading ? 'Processing...' : 'Book tour now!'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className='btn btn--green span-all-rows'
            >
              Login to Book a Tour
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default TourBuy;
