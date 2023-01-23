import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
      );
  };

  return (
    <div className="form-wrapper">

      <div className="x-button">
        <div className="exit" onClick={closeModal}>
          x
          <i className="fa-solid fa-xmark" />
        </div>
      </div>

      <div className="login">Log In</div>


      <form onSubmit={handleSubmit}>
        <ul className="errors">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>

        <div className="form-parts">
        <label>
          <input
            className="input-login"
            placeholder="Username or Email"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            // required
          />
        </label>
        <label>
          <input
            className="input-login"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // required
          />
        </label>
        <button className="login-button" type="submit">Log In</button>

        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
