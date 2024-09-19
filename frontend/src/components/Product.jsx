// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import Card from 'react-bootstrap/Card';
// import Button from 'react-bootstrap/Button';
// import Rating from './Rating';
// import axios from 'axios';
// import { Store } from '../screens/Store';
// import toast from 'react-hot-toast';

// const Product = (props) => {
//   const { product } = props;
//   const { state, dispatch: ctxDispatch } = useContext(Store);

//   const {
//     cart: { cartItems },
//   } = state;

//   const addToCartHandler = async (item) => {
//     const existItem = cartItems.find((x) => x._id === product._id);
//     const quantity = existItem ? existItem.quantity + 1 : 1;
//     const { data } = await axios.get(`/api/products/${item._id}`);
//     if (data.countInStock < quantity) {
//       window.alert('Sorry. Product is out of Stock');
//       return;
//     }
//     ctxDispatch({
//       type: 'CART_ADD_ITEM',
//       payload: { ...item, quantity },
//     });
//     toast.success('added to cart');
//   };
//   return (
//     <Card className="product">
//       <Link to={`/product/${product.slug}`}>
//         <img src={product.image} alt={product.name} className="card-img-top" />
//       </Link>
//       <Card.Body>
//         <Link to={`/product/${product.slug}`}>
//           <Card.Title style={{ fontSize: '15px' }}>{product.name}</Card.Title>
//         </Link>
//         <Rating rating={product.rating} numReviews={product.numReviews} />
//         <Card.Text style={{ fontSize: '14px', fontWeight: 'bold' }}>
//           ${product.price}
//         </Card.Text>
//         {product.countInStock === 0 ? (
//           <Button variant="light" disabled>
//             Out of Stock
//           </Button>
//         ) : (
//           <Button
//             style={{ paddingX: '5px' }}
//             className="btn-sm"
//             onClick={() => addToCartHandler(product)}
//           >
//             Add to Cart
//           </Button>
//         )}
//       </Card.Body>
//     </Card>
//   );
// };

// export default Product;

import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../screens/Store';
import toast from 'react-hot-toast';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Product = (props) => {
  const { product, loading } = props; // Assuming 'loading' is passed as a prop
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of Stock');
      return;
    }
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
    toast.success('Added to cart');
  };

  return (
    <Card className="product rounded-0">
      {loading ? (
        <>
          <Skeleton height={200} />
          <Card.Body>
            <Skeleton count={2} />
            <Skeleton width="60%" />
            <Skeleton width="40%" height={30} />
          </Card.Body>
        </>
      ) : (
        <>
          <Link to={`/product/${product.slug}`}>
            <img
              src={product.image}
              alt={product.name}
              className="card-img-top"
            />
          </Link>
          <Card.Body>
            <Link to={`/product/${product.slug}`}>
              <Card.Title style={{ fontSize: '15px' }}>
                {product.name}
              </Card.Title>
            </Link>
            <Rating rating={product.rating} numReviews={product.numReviews} />
            <Card.Text style={{ fontSize: '14px', fontWeight: 'bold' }}>
              ${product.price}
            </Card.Text>
            {product.countInStock === 0 ? (
              <Button variant="light" disabled>
                Out of Stock
              </Button>
            ) : (
              <Button
                style={{ paddingX: '5px' }}
                className="btn-sm"
                onClick={() => addToCartHandler(product)}
              >
                <i
                  className="fa fa-shopping-cart text-dark"
                  aria-hidden="true"
                ></i>
              </Button>
            )}
          </Card.Body>
        </>
      )}
    </Card>
  );
};

export default Product;
