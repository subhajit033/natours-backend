import ReviewCard from '../Review/ReviewCard'

const TourReviews = ({reviews}) => {
  return (
    <section className='section-reviews'>
      <div className='reviews'>
      {
        reviews?.map((review) => <ReviewCard key={review._id} {...review} myReviews={false} />)
      }
      </div>
    </section>
  );
};

export default TourReviews;
