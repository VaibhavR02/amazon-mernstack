import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './Store';
import { getError } from '../util';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };

    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };

    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };

    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };

    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function OrderListScreen() {
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, orders, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
    // fetchData();
  }, [successDelete, userInfo]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('Order deleted successfully!');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };
  const [searchTerm, setSearchterm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

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
    <div className="orders container">
      <Helmet>
        <title>Orders</title>
      </Helmet>
      <h1>Orders</h1>
      {loadingDelete && <LoadingBox></LoadingBox>}
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
            <table className="table table-bordered ">
              <thead>
                <tr>
                  <th className="text-center">ID</th>
                  <th className="text-center">USER</th>
                  <th className="text-center">DATE</th>
                  <th className="text-center">TOTAL</th>
                  <th className="text-center">PAID</th>
                  <th className="text-center">DELIVERED</th>
                  <th className="text-center">ACTIONS</th>
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
                        {order.user ? order.user.name : 'DELETED USER'}
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
{/*                       <td className="text-center">
                        <span
  className={
    order.isPaid
      ? order.isDelivered
        ? 'bg-success text-center badge'
        : 'bg-warning text-center badge'
      : 'bg-danger text-center badge'
  }
>
  {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NO'}
</span>
                      </td> */}
                     <td className="text-center">
  <span
    className={`badge text-center ${
      order.isPaid
        ? order.isDelivered
          ? 'bg-success'
          : 'bg-warning'
        : 'bg-danger'
    }`}
  >
    {order.isDelivered ? order.deliveredAt.substring(0, 10) : 'NO'}
  </span>
</td>

                      
                      <td className="text-center">
                        <i
                          className="fas fa-trash text-danger"
                          type="button"
                          variant="light"
                          onClick={() => deleteHandler(order)}
                        ></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {<LoadingBox /> && (
            <div className="d-flex justify-content-end">
              <nav className="pagination-container">
                <ul className="pagination">
                  {Array(Math.ceil(filteredData.length / itemPerPage))
                    .fill()
                    .map((_, index) => (
                      <li
                        key={index}
                        className={`page-item ${
                          currentPage === index + 1 ? 'active' : ''
                        }`}
                      >
                        <button
                          className="page-link m-1 "
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </button>
                      </li>
                    ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
