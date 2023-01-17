import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Store } from './Store';
import { toast } from 'react-hot-toast';
import { getError } from '../util';
import logo from './logo.png';
const SignupScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [ConfirmPassword, setConfirmPassword] = useState('');
  const { state, dispatch: ctxDispatch } = useContext(Store);

  const { userInfo } = state;
  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== ConfirmPassword) {
      toast.error('Password does not match');
      return;
    }
    try {
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
        ConfirmPassword,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });

      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('successfull created account');
      navigate(redirect || '/');
    } catch (err) {
      toast.error(getError(err));
      // alert('invalid email or password');
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <>
      <section>
        <Helmet>
          <title>Sign up</title>
        </Helmet>
        <div className="amazon-logo">
          <img src={logo} alt="" />
          <span>.in</span>
        </div>
        <div className="amazon-card">
          <form onSubmit={submitHandler}>
            {' '}
            <h1>Sign up</h1>
            <div className="amazon-from">
              <label htmlFor="">Name</label>
              <br />
              <input
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
              />
              <br />
              <label htmlFor="">Email or mobile</label>
              <br />
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="text"
              />
              <br />
              <label htmlFor="">Password</label>
              <br />
              <input
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
              />
              <label htmlFor="">Confirm Password</label>
              <br />
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                type="password"
              />
              <Button className="amazon-button" type="submit">
                Continue
              </Button>
            </div>
          </form>
          <p>
            By continuing you agree to Amazon's{' '}
            <Link to="">Condition of Use</Link> and <Link> Policy Notice </Link>
          </p>
          <Link className="amazon-icon">Need help?</Link>{' '}
          <div className="break">
            <p>Already have an account?</p>
          </div>
          <Link to={`/signin?redirect=${redirect}`}>Sign In</Link>
        </div>
      </section>
    </>
  );
};

export default SignupScreen;
