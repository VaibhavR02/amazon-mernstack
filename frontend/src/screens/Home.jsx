import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import banner1 from '../banner/amazon.jpg';
import banner2 from '../banner/amazon2.jpg';
import banner3 from '../banner/amazon3.jpg';
import banner4 from '../banner/amazon4.jpg';
import banner5 from '../banner/amazon5.jpg';
import banner6 from '../banner/banner-6.jpg';
import Carousel from 'react-bootstrap/Carousel';
import { useReducer } from 'react';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

// import data from '../data';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const Home = () => {
  // const [products, setProducts] = useState([]);

  const [{ loading, error, products }, dispatch] = useReducer(logger(reducer), {
    products: [],
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="">
        <Helmet>
          <title>amazon</title>
        </Helmet>
        {/* ------------------------------------------- */}

        <Carousel fade indicators={''}>
          <Carousel.Item>
            <img
              className="d-block w-100 images "
              src={banner1}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 images "
              src={banner2}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 images "
              src={banner3}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100  images"
              src={banner6}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 images "
              src={banner4}
              alt="First slide"
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100 images "
              src={banner5}
              alt="First slide"
            />
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="mx-5">
        <h1>Featured products</h1>
        <div className="products">
          {loading ? (
            <LoadingBox />
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product.slug} sm={6} md={4} lg={3} className="mb-3">
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
