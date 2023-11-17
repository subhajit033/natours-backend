import React from 'react';
import { iconsSvg } from '../../assets/image';
const TourName = ({ name, duration, startLocation, imageCover }) => {
  return (
    <section className='section-header'>
      <div className='header__hero'>
        <div className='header__hero-overlay'>&nbsp;</div>
        <img className='header__hero-img' src={imageCover} alt='Tour 5' />
      </div>
      <div className='heading-box'>
        <h1 className='heading-primary'>
          <span>{name}</span>
        </h1>
        <div className='heading-box__group'>
          <div className='heading-box__detail'>
            <svg className='heading-box__icon'>
              <use xlinkHref={`${iconsSvg}#icon-clock`} />
            </svg>
            <span className='heading-box__text'>{duration} days</span>
          </div>
          <div className='heading-box__detail'>
            <svg className='heading-box__icon'>
              <use xlinkHref={`${iconsSvg}#icon-map-pin`} />
            </svg>
            <span className='heading-box__text'>
              {startLocation.description}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TourName;
