import { useState, useEffect } from 'react';
import TourCard from './TourCard';
import axios from 'axios';
import { api_url } from '../../utils/helper';
import Loader from '../Loader/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { addTours } from '../../redux/tourData';

const OverView = () => {
  const dispatch = useDispatch();
  const [tour, setTour] = useState([]);
  const tours = useSelector((store) => store.tour.tours);
  useEffect(() => {
    !tours && getTourData();
    if (tours) {
      setTour(tours);
    }
  }, []);
  const getTourData = async () => {
    try {
      const data = await axios.get('/api/v1/tours', {withCredentials: true});
      setTour(data?.data?.data?.data);
      dispatch(addTours(data?.data?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };
  console.log(tour);
  return tour.length === 0 ? (
    <Loader />
  ) : (
    <main className='main'>
      <div className='card-container'>
        {tour.map((tour, i) => {
          return <TourCard key={i} {...tour} />;
        })}
      </div>
    </main>
  );
};

export default OverView;
