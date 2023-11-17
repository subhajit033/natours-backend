/*eslint-disable */

import { iconsSvg } from '../../assets/image';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const TourCard = ({
  name,
  summary,
  startDates,
  price,
  maxGroupSize,
  imageCover,
  startLocation,
  difficulty,
  duration,
  locations,
  ratingsAverage,
  ratingsQuantity,
  slug,
  _id,
}) => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className='card'>
      <div className='card__header'>
        <div className='card__picture'>
          <div className='card__picture-overlay'>&nbsp;</div>
          <img
            src={imageCover}
            alt='Tour cover image'
            className='card__picture-img'
          />
        </div>

        <h3 className='heading-tertirary'>
          <span>{name}</span>
        </h3>
      </div>

      <div className='card__details'>
        <h4 className='card__sub-heading'>{`${difficulty} ${duration}-day tour`}</h4>
        <p className='card__text'>{summary}</p>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref={`${iconsSvg}#icon-map-pin`} />
          </svg>
          <span>{startLocation.description}</span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref={`${iconsSvg}#icon-calendar`} />
          </svg>
          <span>
            {new Date(startDates[0]).toLocaleString('en-US', {
              month: 'long',
              year: 'numeric',
            })}
          </span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref={`${iconsSvg}#icon-flag`} />
          </svg>
          <span>{`${locations.length} stops`}</span>
        </div>
        <div className='card__data'>
          <svg className='card__icon'>
            <use xlinkHref={`${iconsSvg}#icon-user`} />
          </svg>
          <span>{`${maxGroupSize} people`}</span>
        </div>
      </div>

      <div className='card__footer'>
        <p>
          <span className='card__footer-value'>₹ {price}</span>
          {' '}
          <span className='card__footer-text'>per person</span>
        </p>
        <p className='card__ratings'>
          <span className='card__footer-value'>{ratingsAverage}</span>
          {' '}
          <span className='card__footer-text'>{`rating (${ratingsQuantity})`}</span>
        </p>
        <button onClick={()=> {navigate(`/${slug}`)}} className='btn btn--green btn--small'> Details</button>
      </div>
    </div>
  );
};

export default TourCard;
