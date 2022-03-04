import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useUser } from "../../Contexts/UserContext";

const Signin = () => {
  const { dispatch } = useUser();

  // * states for signin:
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // *history hooks:
  const history = useHistory();

  const submitFormData = (e) => {
    e.preventDefault();
    fetch("/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) =>
        res.json().then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            dispatch({ type: "USER", payload: data.user });
            history.push("/");
          }
        })
      )
      .catch((err) => console.log(err));
  };

  return (
    <div className="signin">
      <div className="signin__card">
        <h1>Clickera</h1>
        <form onSubmit={submitFormData} className="signin__card__form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn signin-btn">Login</button>
        </form>
        <p>
          By signing up you agree to our Terms, Data Policy and Cookies Policy
        </p>
      </div>
      <div className="signin__signup-link">
        <p>
          Don't have an account?
          <Link to="/Signup" className="signup-link">
            Sign up
          </Link>
        </p>
      </div>
      <div className="signin__signup-link">
        <p>
          Forget Password?
          <Link to="/resetpassword" className="signup-link">
            Update Password
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
