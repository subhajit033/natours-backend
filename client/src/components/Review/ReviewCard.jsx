import { iconsSvg } from '../../assets/image.js';

const ReviewCard = ({ user, review, rating }) => {
  return (
    <div className='reviews__card'>
      <div className='reviews__avatar'>
        <img
          src={user?.photo}
          alt='Jim Brown'
          className='reviews__avatar-img'
        />
        <h6 className='reviews__user'>{user?.name}</h6>
      </div>
      <p className='reviews__text'>{review}</p>
      <div className='reviews__rating'>
        {[1, 2, 3, 4, 5].map((num, i) => {
          return (
            <svg
              key={i}
              className={`reviews__star reviews__star--${
                rating >= num ? 'active' : 'inactive'
              }`}
            >
              <use xlinkHref={`${iconsSvg}#icon-star`} />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export default ReviewCard;
