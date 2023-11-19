import { useEffect, useState } from 'react';
import ReviewCard from './ReviewCard';
import axios from 'axios';
import Loader from '../Loader/Loader';
const MyReview = () => {
  const [myReviews, setMyReviews] = useState(null);
  useEffect(() => {
    getMyReviews();
  }, []);
  const getMyReviews = async () => {
    const res = await axios.get('/api/v1/users/me/myReviews');
    console.log(res);
    if (res?.data?.status === 'success') {
      setMyReviews(res?.data?.data?.reviews.reviews);
    }
  };
  return !myReviews ? (
    <Loader />
  ) : myReviews.length === 0 ? (
    <h1>You have not reviewd any tour yet</h1>
  ) : (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1.5rem',
      }}
    >
      {myReviews?.map((review, i) => (
        <ReviewCard key={i} {...review} myReviews={true} />
      ))}
    </div>
  );
};

export default MyReview;
