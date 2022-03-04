import React, { useState } from "react";
import { useHistory } from "react-router-dom";

const PasswordReset = () => {
  // * states for signin:
  const [email, setEmail] = useState("");
  // *history hooks:
  const history = useHistory();

  const submitFormData = (e) => {
    e.preventDefault();
    fetch("/resetpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
      }),
    })
      .then((res) =>
        res.json().then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert(data.message);
            history.push("/signin");
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
          <button className="btn signin-btn">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
