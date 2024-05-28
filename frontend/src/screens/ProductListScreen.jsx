import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from './Store';
import { toast } from 'react-hot-toast';
import { getError } from '../util';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function ProductListScreen() {
  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [searchTerm, setSearchterm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/admin?page=${page}`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product deleted successfully');
        dispatch({
          type: 'DELETE_SUCCESS',
        });
      } catch (err) {
        toast.error(getError(err));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  const filteredData = products
    ? products.filter(
        (item) =>
          item._id.includes(searchTerm) ||
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : //  ||
      //   products.filter((item) =>
      //     item.category.toLowerCase().includes(searchTerm.toLowerCase())
      //   ) ||
      //   products.filter((item) =>
      //     item.brand.toLowerCase().includes(searchTerm.toLowerCase())
      //   )
      [];

  return (
    <div className="container my-2">
      <Row>
        <Col>
          <h1>Products</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" className="btn-sm" onClick={createHandler}>
              Create Product
            </Button>
          </div>
        </Col>
      </Row>
      {loadingCreate && <LoadingBox></LoadingBox>}
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
              placeholder="search products..."
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
                  <th className="text-center">SR.</th>
                  <th className="text-center">ID</th>
                  <th className="text-center">NAME</th>
                  <th className="text-center">PRICE</th>
                  <th className="text-center">CATEGORY</th>
                  <th className="text-center">BRAND</th>
                  <th className="text-center">STOCK</th>
                  <th className="text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center bg-warning fw-bold">
                      No products found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((product, index) => (
                    <tr key={product._id} className="">
                      <td className="text-center">{index + 1}</td>
                      <td className="text-center">
                        {' '}
                        <Link to={`/product/${product.slug}`}>
                          {product._id}
                        </Link>
                      </td>
                      <td className="text-center">{product.name}</td>
                      <td className="text-center">{product.price}</td>
                      <td className="text-center">{product.category}</td>
                      <td className="text-center">{product.brand}</td>
                      <td className="text-center">
                        {product.countInStock < 10 ? (
                          <span className="badge bg-danger">
                            {product.countInStock}
                          </span>
                        ) : (
                          <span className="badge bg-success">
                            {product.countInStock}
                          </span>
                        )}
                      </td>
                      <td className="text-center">
                        <i
                          className="fas fa-edit text-warning mx-1"
                          type="button"
                          variant="light"
                          onClick={() =>
                            navigate(`/admin/product/${product._id}`)
                          }
                        ></i>
                        &nbsp;
                        <i
                          className="btn-sm fas fa-trash text-danger mx-1"
                          variant="light"
                          onClick={() => deleteHandler(product)}
                        ></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="orders d-flex justify-content-end">
              {[...Array(pages).keys()].map((x) => (
                <Link
                  className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                  key={x + 1}
                  to={`/admin/products?page=${x + 1}`}
                >
                  {x + 1}
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
