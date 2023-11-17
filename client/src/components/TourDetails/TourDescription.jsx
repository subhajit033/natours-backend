/*eslint-disable*/

import React from 'react';
import { iconsSvg } from '../../assets/image';
import TourGuides from './TourGuides';
const TourDescription = ({
  name,
  startDates,
  difficulty,
  maxGroupSize,
  ratingsAverage,
  guides
}) => {
  return (
    <section className='section-description'>
      <div className='overview-box'>
        <div>
          <div className='overview-box__group'>
            <h2 className='heading-secondary ma-bt-lg'>Quick facts</h2>
            <div className='overview-box__detail'>
              <svg className='overview-box__icon'>
                <use xlinkHref={`${iconsSvg}#icon-calendar`} />
              </svg>
              <span className='overview-box__label'>Next date</span>
              <span className='overview-box__text'>
                {new Date(startDates[0]).toLocaleString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
            <div className='overview-box__detail'>
              <svg className='overview-box__icon'>
                <use xlinkHref={`${iconsSvg}#icon-trending-up`} />
              </svg>
              <span className='overview-box__label'>Difficulty</span>
              <span className='overview-box__text'>{difficulty}</span>
            </div>
            <div className='overview-box__detail'>
              <svg className='overview-box__icon'>
                <use xlinkHref={`${iconsSvg}#icon-user`} />
              </svg>
              <span className='overview-box__label'>Participants</span>
              <span className='overview-box__text'>{`${maxGroupSize} people`}</span>
            </div>
            <div className='overview-box__detail'>
              <svg className='overview-box__icon'>
                <use xlinkHref={`${iconsSvg}#icon-star`} />
              </svg>
              <span className='overview-box__label'>Rating</span>
              <span className='overview-box__text'>{`${ratingsAverage} / 5`}</span>
            </div>
          </div>

          <div className='overview-box__group'>
            <h2 className='heading-secondary ma-bt-lg'>Your tour guides</h2>
            {guides?.map((guide) => <TourGuides key={guide._id} {...guide} />)}
          </div>
        </div>
      </div>

      <div className='description-box'>
        <h2 className='heading-secondary ma-bt-lg'>
          {`About ${name.toLowerCase()} tour`}
        </h2>
        <p className='description__text'>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur.
        </p>
        <p className='description__text'>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
          dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
          proident, sunt in culpa qui officia deserunt mollit anim id est
          laborum!
        </p>
      </div>
    </section>
  );
};

export default TourDescription;
