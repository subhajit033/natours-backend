const TourPictures = ({ images }) => {
  return (
    <section className='section-pictures'>
      {images?.map((image, i) => {
        return (
          <div key={`image-${i}`} className='picture-box'>
            <img
              className='picture-box__img picture-box__img--1'
              src={image}
              alt='tour-images'
            />
          </div>
        );
      })}
    </section>
  );
};

export default TourPictures;
