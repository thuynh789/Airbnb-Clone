import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./DemoUser.css";

function DemoUser() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("Demo-lition");
  const [password, setPassword] = useState("password");
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
  };

  return (
    <>
    <div className='button'>
      <div className='clickable-div' onClick={handleSubmit}>
        Demo User Login
      </div>
    </div>
    </>
  );
}

export default DemoUser;
