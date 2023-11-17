import React from 'react';

const TourGuides = ({role, name, photo}) => {
  return (
    <div className='overview-box__detail'>
      <img
        src={photo}
        alt='guide images'
        className='overview-box__img'
      />
      <span className='overview-box__label'>{role}</span>
      <span className='overview-box__text'>{name}</span>
    </div>
  );
};

export default TourGuides;
