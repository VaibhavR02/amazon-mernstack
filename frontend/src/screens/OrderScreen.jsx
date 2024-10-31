import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import dotenv from 'dotenv';
import ListGroup from 'react-bootstrap/ListGroup';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './Store';
import { getError } from '../util';
import { toast } from 'react-hot-toast';
import Modal from 'react-bootstrap/Modal';
import './PaytmModal.css'; // Add this CSS file to style the modal

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    default:
      return state;
  }
}
export default function OrderScreen() {
  // dotenv.config();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const [razorpayKeyId, setRazorpayKeyId] = useState('');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState('');

  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    successPay: false,
    loadingPay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const paymentMethod = localStorage.getItem('paymentMethod');

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
        localStorage.removeItem('paymentMethod');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        // console.log(data);

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }

    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'USD',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };

      const getRazorpayKey = async () => {
        const { data } = await axios.get('/api/config/razorpay');
        setRazorpayKeyId(data.keyId);
        setRazorpayKeySecret(data.keySecret);
      };

      loadPaypalScript();
      getRazorpayKey();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler() {
    try {
      dispatch({ type: 'DELIVER_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  }

  function handleRazorpayPayment() {
    const options = {
      key: razorpayKeyId,
      key_secret: razorpayKeySecret,
      amount: order.totalPrice * 100, // Razorpay works with paise, so multiply by 100
      currency: 'INR',
      name: 'Amazon Merchant',
      description: 'Order Payment',
      order_id: orderId, // you need to generate this on the server
      handler: async function (response) {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${order._id}/pay`,
            response, // sending Razorpay payment response to backend
            { headers: { authorization: `Bearer ${userInfo.token}` } }
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          toast.success('Order is paid');
          localStorage.removeItem('paymentMethod');
        } catch (err) {
          dispatch({ type: 'PAY_FAIL', payload: getError(err) });
          toast.error(getError(err));
        }
      },
      prefill: {
        name: userInfo.name,
        email: userInfo.email,
        contact: '1234567890',
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  }
  // State to manage the Paytm modal visibility
  const [showPaytmModal, setShowPaytmModal] = useState(false);

  const closeModal = () => {
    setShowPaytmModal(false); // Close modal
  };

  // const handlePaytmPayment = async (e) => {
  //   e.preventDefault();
  //   try {
  //     setShowPaytmModal(true); // Show modal for user experience

  //     dispatch({ type: 'PAY_REQUEST' });
  //     const { data } = await axios.put(`/api/orders/${order._id}/pay`, order, {
  //       headers: { authorization: `Bearer ${userInfo.token}` },
  //     });
  //     dispatch({ type: 'PAY_SUCCESS', payload: data });
  //     toast.success('Order is paid using paytm');
  //   } catch (err) {
  //     dispatch({ type: 'PAY_FAIL', payload: getError(err) });
  //     toast.error(getError(err));
  //   }
  // };

  const handlePaytmPayment = (e) => {
    e.preventDefault();
    setShowPaytmModal(true); // Open the modal without triggering payment
  };

  const confirmPaytmPayment = async () => {
    try {
      dispatch({ type: 'PAY_REQUEST' });
      const { data } = await axios.put(`/api/orders/${order._id}/pay`, order, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: 'PAY_SUCCESS', payload: data });
      toast.success('Order is paid using Paytm');
      localStorage.removeItem('paymentMethod');
      closeModal();
    } catch (err) {
      dispatch({ type: 'PAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div className="container">
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1 className="my-3">Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                <strong>Address: </strong> {order.shippingAddress.address},
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
                &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.delieveredAt.slice(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt.slice(0, 10)}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong> Order Total</strong>
                    </Col>
                    <Col>
                      <strong>${order.totalPrice.toFixed(2)}</strong>
                    </Col>
                  </Row>
                </ListGroup.Item>
                {/* {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )} */}

                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        {order.paymentMethod === 'PayPal' && (
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}
                          ></PayPalButtons>
                        )}
                        {order.paymentMethod === 'RazorPay' && (
                          <Button
                            id="razorpay-button"
                            onClick={handleRazorpayPayment} // Call handleRazorpayPayment function
                          >
                            Pay with Razorpay
                          </Button>
                        )}

                        {order.paymentMethod === 'Paytm' && (
                          <Button
                            onClick={handlePaytmPayment}
                            className="btn  paytmbutton"
                          >
                            Pay with Paytm
                          </Button>
                        )}

                        {/* <Modal
                          show={showPaytmModal}
                          onHide={closeModal}
                          centered
                        >
                          <Modal.Header closeButton>
                            <Modal.Title>Pay with Paytm</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p>
                              This is a demo Paytm payment experience for
                              testing purposes.
                            </p>
                            <p>
                              <strong>Order Total:</strong> ₹{order.totalPrice}
                            </p>
                            <p>Please proceed to payment through Paytm.</p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={closeModal}>
                              Close
                            </Button>
                            <Button
                              variant="primary"
                              onClick={confirmPaytmPayment}
                            >
                              Confirm Payment
                            </Button>
                          </Modal.Footer>
                        </Modal> */}

                        <Modal
                          show={showPaytmModal}
                          onHide={closeModal}
                          centered
                        >
                          <Modal.Header
                            closeButton
                            className="paytm-modal-header"
                          >
                            <Modal.Title>
                              <img
                                src="https://pwebassets.paytm.com/commonwebassets/paytmweb/header/images/logo.svg" // Replace with Paytm logo or any relevant logo for a similar look
                                alt="Paytm"
                                className="paytm-logo"
                              />
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p className="paytm-info"></p>
                            <p className="paytm-order-total">
                              <strong> Total:</strong> ₹{order.totalPrice}
                            </p>
                            <p className="paytm-instruction">
                              Please proceed to payment through Paytm.
                            </p>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={closeModal}
                              className="paytm-button"
                            >
                              Close
                            </Button>
                            <Button
                              variant="primary"
                              onClick={confirmPaytmPayment}
                              className="paytm-button paytm-confirm-button"
                            >
                              Confirm Payment
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}

                {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    {loadingDeliver && <LoadingBox></LoadingBox>}
                    <div className="d-grid">
                      <Button type="button" onClick={deliverOrderHandler}>
                        Deliver Order
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
