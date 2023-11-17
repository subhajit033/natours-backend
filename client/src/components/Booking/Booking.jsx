import { useState, useEffect } from 'react';
import BookingTourCard from './BookingTourCard';
import { api_url } from '../../utils/helper';
import axios from 'axios';
const Booking = () => {
  const [bookedTour, setBookedTour] = useState(null);
  useEffect(() => {
    getBookedTours();
  }, []);

  const getBookedTours = async () => {
    try {
      const res = await axios.get('/api/v1/users/myTours', {
        withCredentials: true,
      });
      console.log(res);
      if (res?.data?.status === 'success') {
        setBookedTour(res?.data?.bookedTours);
      } else {
        throw new Error('No tour');
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <section style={{ flex: 1 }}>
      <h1 style={{ textAlign: 'center', marginTop: '1rem' }}>My Booking</h1>
      {!bookedTour || bookedTour.length === 0 ? (
        <h1>No tour booked yet</h1>
      ) : (
        <div className='booking-card-container'>
          {bookedTour.map((tour, i) => {
            return (
              <BookingTourCard
                key={i}
                {...tour.tourDetails[0]}
                price={tour.price}
              />
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Booking;
