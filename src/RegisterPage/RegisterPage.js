import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import config from "../_configs/configs.json";
import { userActions, appActions } from "../_actions";
import { TopNavbar } from "../_components";
import { history } from "../_helpers";

function RegisterPage() {
  const dispatch = useDispatch();
  const registering = useSelector((state) => state.registration.registering);

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState(false);

  // Reset login status.
  useEffect(() => {
    dispatch(userActions.logout());
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setUser((user) => ({ ...user, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setSubmitted(true);
    if (user.firstName && user.lastName && user.username && user.password) {
      dispatch(userActions.register(user));
    }
  }

  const goToGuestChallenge = () => {
    dispatch(appActions.setTrainingDataSet(config.DEFAULT_GUEST_CHALLENGE));
    history.push("/guest");
  };

  return (
    <>
      <TopNavbar />
      <div className="col-lg-8 offset-lg-3 verticalUpper">
        <h2 className="text-white">Register</h2>
        <form name="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="text-white">First Name</label>
            <input
              type="text"
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              className={
                "form-control" +
                (submitted && !user.firstName ? " is-invalid" : "")
              }
            />
            {submitted && !user.firstName && (
              <div className="invalid-feedback">First Name is required</div>
            )}
          </div>
          <div className="form-group">
            <label className="text-white">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              className={
                "form-control" +
                (submitted && !user.lastName ? " is-invalid" : "")
              }
            />
            {submitted && !user.lastName && (
              <div className="invalid-feedback">Last Name is required</div>
            )}
          </div>
          <div className="form-group">
            <label className="text-white">Username</label>
            <input
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
              className={
                "form-control" +
                (submitted && !user.username ? " is-invalid" : "")
              }
            />
            {submitted && !user.username && (
              <div className="invalid-feedback">Username is required</div>
            )}
          </div>
          <div className="form-group">
            <label className="text-white">Password</label>
            <input
              type="text"
              name="password"
              value={user.password}
              onChange={handleChange}
              className={
                "form-control" +
                (submitted && !user.password ? " is-invalid" : "")
              }
            />
            {submitted && !user.password && (
              <div className="invalid-feedback">Password is required</div>
            )}
          </div>
          <div className="form-group">
            <button className="btn btn-primary">
              {registering && (
                <span className="spinner-border spinner-border-sm mr-1"></span>
              )}
              Register
            </button>
            <Link to="/login" className="btn btn-link">
              Cancel
            </Link>
            <Link onClick={goToGuestChallenge} className="btn btn-link">
              Try as Guest
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}

export { RegisterPage };
