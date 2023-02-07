import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import Carousel from 'react-bootstrap/Carousel';
import { useReducer } from 'react';
import logger from 'use-reducer-logger';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../components/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import bannerimgs from '../banner/BannerAPI';
import brandImgs from '../banner/BrandAPI';

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
      <div className="m-2">
        <Helmet>
          <title>Amazon</title>
        </Helmet>
        {/* ------------------------------------------- */}

        <Carousel fade indicators={''}>
          {bannerimgs.map((item, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 rounded images "
                src={item.imgSrc}
                alt="First slide"
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <div className="brand mx-3 my-2 ">
          {brandImgs.map((item, index) => (
            <img key={index} src={item.imgSrc} alt="banner1" />
          ))}
        </div>
      </div>

      <div className="mx-5 ">
        <h1>Featured Products</h1>
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
