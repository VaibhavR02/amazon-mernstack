import { BrowserRouter, redirect, Route, Routes } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import { toast, Toaster } from 'react-hot-toast';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Home from './screens/Home';
import ProductScreen from './screens/ProductScreen';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import logo from './screens/logo1.png';
import { useContext, useEffect, useState } from 'react';
import { Store } from './screens/Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { getError } from './util';
import SerachBox from './components/SerachBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoutes';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRote';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';

import Loader from './components/Loader';
import Footer from './components/Footer';
// import RazorpayComponent from './screens/RazorpayComponent';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [siderbarIsOpen, setSidebarIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);

  return (
    <BrowserRouter>
      <div
        className={
          siderbarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      >
        <header>
          <Navbar
            bg="dark"
            variant="dark"
            expand="lg"
            className="navbar"
            style={{ opacity: '1', zIndex: '2500' }}
          >
            <Container>
              <Button
                className="me-2"
                variant="dark"
                onClick={() => setSidebarIsOpen(!siderbarIsOpen)}
              >
                {' '}
                <i className="fas fa-bars"></i>{' '}
              </Button>
              <LinkContainer to={'/'}>
                <Navbar.Brand>
                  <div className="amazon-logo">
                    <img src={logo} alt="" />
                    <span>.in</span>
                  </div>
                </Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle
                aria-controls="basic-navbar-nav"
                className="border-0"
              />
              <Navbar.Collapse id="basic-navbar-nav">
                <SerachBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    <i className="fa fa-shopping-cart text-white"></i>
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to={'/profile'}>
                        <NavDropdown.Item> User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to={'/orderhistory'}>
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>

                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}

                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            siderbarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column   text-white my-2 w-100 ">
            <p className=" text-white ms-3 ">
              Hello,&nbsp;
              <b>
                {userInfo ? (
                  userInfo.name
                ) : (
                  <Link className="ms-2" to={`/signin?redirect=${redirect}`}>
                    User
                  </Link>
                )}
              </b>{' '}
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="btn closeBtn text-white "
              >
                <i className="fas fa-times "></i>
              </button>
            </p>

            <Nav.Item>
              <strong>Categories </strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={{
                    pathname: '/search',
                    search: `category=${category}`,
                  }}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          {loading && <Loader />}
          <div>
            <Routes>
              {/* -------admin------- */}

              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              />

              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              />

              {/* -------admin------- */}

              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/" element={<Home />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/shipping" element={<ShippingAddressScreen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    {' '}
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              {/* <Route
                path="/razorpay"
                element={
                  <ProtectedRoute>
                    <RazorpayComponent />
                  </ProtectedRoute>
                }
              /> */}
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>
        <Footer />
      </div>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
