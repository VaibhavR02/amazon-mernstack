import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './Store';
import { getError } from '../util';
import Button from 'react-bootstrap/esm/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const [searchTerm, setSearchterm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/orders/mine`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const filteredData = orders
    ? orders.filter((item) => item._id.includes(searchTerm))
    : [];

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentOrders = filteredData
    .slice()
    .reverse()
    .slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="container">
      <Helmet>
        <title>Order History</title>
      </Helmet>

      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <div className="d-flex justify-content-end align-items-end ">
            <input
              type="text"
              placeholder="search order..."
              value={searchTerm}
              onChange={(e) => setSearchterm(e.target.value)}
              className="form-control my-2"
              style={{ width: '300px' }}
            />
          </div>
          <div className="orders">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">DATE</th>
                  <th className="text-center">TOTAL</th>
                  <th className="text-center">PAID</th>
                  <th className="text-center">DELIVERED</th>
                  <th className="text-center">DETAILS</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center bg-warning fw-bold">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  currentOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="text-center">
                        <Link
                          className=""
                          type="button"
                          variant="light"
                          to={`/order/${order._id}`}
                          target="_blank"
                        >
                          {order._id}
                        </Link>
                      </td>

                      <td className="text-center">
                        {order.createdAt.substring(0, 10)}
                      </td>
                      <td className="text-center">
                        {order.totalPrice.toFixed(2)}
                      </td>
                      <td className="text-center">
                        <span
                          className={
                            order.isPaid
                              ? 'bg-success text-center badge '
                              : 'bg-danger text-center badge '
                          }
                        >
                          {order.isPaid ? order.paidAt.substring(0, 10) : 'NO'}
                        </span>
                      </td>

                      <td className="text-center">
                        <span
                          className={`badge text-center ${
                            order.isPaid
                              ? order.isDelivered
                                ? 'bg-success' // Paid and delivered
                                : 'bg-warning' // Paid but not delivered
                              : 'bg-danger' // Not paid
                          }`}
                        >
                          {order.isDelivered ? 'Yes' : 'No'}
                        </span>
                      </td>

                      <td className="text-center">
                        <Link
                          className="btn btn-sm btn-light"
                          type="button"
                          variant="light"
                          to={`/order/${order._id}`}
                          target="_blank"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
