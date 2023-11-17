import { useState, useEffect } from 'react';
import { api_url } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import TourName from './TourName';
import TourDescription from './TourDescription';
import TourPictures from './TourPictures';
import TourReviews from './TourReviews';
import TourBuy from './TourBuy';
import Loader from '../Loader/Loader';
import MapBox from './MapBox';
import axios from 'axios';
const TourDetails = () => {
  const { tourName } = useParams();
  console.log(tourName);
  const [tourData, setTourData] = useState(null);

  useEffect(() => {
    getSpecificTourDetails(tourName);
    window.scrollTo(0, 0);
  }, []);
  const getSpecificTourDetails = async (tourName) => {
    try {
      const tourData = await axios.get(`/api/v1/tours/${tourName}`, {withCredentials: true});
      setTourData(tourData?.data?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  return !tourData ? (
    <Loader />
  ) : (
    <>
      <TourName {...tourData} />
      <TourDescription {...tourData} />
      <TourPictures {...tourData} />
      <MapBox {...tourData} />
      <TourReviews {...tourData} />
      <TourBuy {...tourData} tourSlug={tourName} />
    </>
  );
};

export default TourDetails;
