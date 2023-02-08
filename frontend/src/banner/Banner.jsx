import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import styled from 'styled-components';
import bannerimgs from '../banner/BannerAPI';

const Banner = (props) => {
  var settings = {
    dots: true,
    isFinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <>
      <CarouselImages {...settings}>
        {bannerimgs.map((item, index) => (
          <Wrap key={index}>
            <div>
              {' '}
              <img src={item.imgSrc} alt="slide1" />{' '}
            </div>
          </Wrap>
        ))}
      </CarouselImages>
    </>
  );
};

const CarouselImages = styled(Slider)`
  overflow: hidden;

  opacity: 1;
  z-index: 1500;
  ul li button {
    &::before {
      font-size: 11px;
      color: rgb(150, 158, 171);
    }
  }
  ul li.slick-active button {
    &::before {
      color: #fff !important;
    }
  }
  & > button {
    opacity: 0;
    z-index: 1500;
    width: 5vw;
    height: 100%;
    &:hover {
      opacity: 1;
      z-index: 2000;
      transition: opacity 0.2s ease 0s;
    }
  }
  .slick-prev {
    left: 0%;
  }
  .slick-next {
    right: 0%;
  }
  .slick-list {
    overflow: initial !important;
  }
`;

const Wrap = styled.div`
  position: relative;
  div {
    border-radius: 4px;
    padding: 4px;
    display: block;
    opacity: 1;
    z-index: 2000;
    box-shadow: rgb(0 0 0 /69%) 0px 16px 10px -10px,
      rgb(0 0 0 /73%) 0px 6px 10px -10px;
    cursor: default;
    img {
      width: 100%;
      height: 100%;

      object-fit: cover;
      border-radius: 4px;
      @media screen and (min-width: 375px) and (max-width: 550px) {
        width: 100%;
        height: 23vh;
        object-fit: fill;
      }
      @media screen and (min-width: 280px) and (max-width: 375px) {
        width: 100%;
        height: 20vh;
        object-fit: fill;
      }
    }
    &:hover {
      transition-duration: 3000;
    }
  }
`;
export default Banner;
