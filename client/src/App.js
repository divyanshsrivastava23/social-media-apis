import React, { useEffect } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { useUser } from "./Contexts/UserContext";
import "./app.scss";

//* components
import Nav from "./components/Nav";
import Home from "./components/screens/Home";
import Profile from "./components/screens/Profile";
import Signin from "./components/screens/Signin";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import UserProfile from "./components/screens/UserProfile";
import FollowingPost from "./components/screens/FollowingPost";
import PasswordReset from "./components/screens/PasswordReset";
import NewPassword from "./components/screens/NewPassword";

//* importing usercontext as userprovider:
import { UserProvider } from "./Contexts/UserContext";

//* another component for routes to access history.
const Routes = () => {
  const history = useHistory();
  const { dispatch } = useUser();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      if (!history.location.pathname.startsWith("/resetpassword"))
        history.push("/signin");
    }
  }, [history, dispatch]);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/createpost" component={CreatePost} />
      <Route exact path="/profile/:userId" component={UserProfile} />
      <Route exact path="/followingposts" component={FollowingPost} />
      <Route exact path="/resetpassword" component={PasswordReset} />
      <Route exact path="/resetpassword/:token" component={NewPassword} />
    </Switch>
  );
};

function App() {
  return (
    <>
      <UserProvider>
        <BrowserRouter>
          <Nav />
          <Routes />
        </BrowserRouter>
      </UserProvider>
    </>
  );
}

export default App;
