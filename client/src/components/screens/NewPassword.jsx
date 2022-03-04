import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const { token } = useParams();
  console.log(token);

  // *history hooks:
  const history = useHistory();

  const submitFormData = (e) => {
    e.preventDefault();
    fetch("/newpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password: password,
        token: token,
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
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn signin-btn">Update Password</button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
