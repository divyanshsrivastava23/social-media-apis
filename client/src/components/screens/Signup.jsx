import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";

const Signup = () => {
  // * States for sign up:
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  // * Historyhook:
  const history = useHistory();

  // * Functions:
  const postUserData = (e) => {
    e.preventDefault();
    fetch("/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      // ! stringify -> sends data as json string.
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
        username: username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          history.push("/signin");
        }
      })
      .catch((err) => {
        console.log(err);
      });

    setEmail("");
    setName("");
    setPassword("");
    setUserName("");
  };

  return (
    <div className="signup">
      <div className="signup__card">
        <h1>Clickera</h1>
        <form onSubmit={postUserData} className="signup__card__form">
          <input
            type="email"
            placeholder="Email"
            required="required"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Full Name"
            required="required"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            required="required"
            value={username}
            onChange={(e) => setUserName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required="required"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn signup-btn">Sign up</button>
        </form>
        <p>
          By signing up you agree to our Terms, Data Policy and Cookies Policy
        </p>
      </div>
      <div className="signup__login-link">
        <p>
          Have an account?
          <Link to="/signin" className="login-link">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
