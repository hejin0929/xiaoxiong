import React, { useEffect } from 'react';

import { connect } from 'react-redux';

// 引入Login页面
import Login from './view/login';
// 引入首页
import Home from './view/home';
// 引入注册页面
import Register from './view/login/register';
// 引入找回密码页面
import Retrieve from './view/login/retrieve';
// 引入个人设置的页面
import SetUp from './view/set_up';

// 引入路由
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';


function App(props) {

  useEffect(() => {
    if (props.validTime >= 0 && localStorage.getItem("token")) {
      var interval = setInterval(() => {
        props.setValidTime({ type: "setValidTime" });
        window.clearInterval(interval);
      }, 10000)
    }
    return () => {
      window.clearInterval(interval);
      if (props.validTime <= 0 && window.location.hash.indexOf("login") === -1) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [props, props.validTime])

  useEffect(() => {
    props.setValidTime({ type: "refresh" });
  }, [props])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/retrieve" component={Retrieve} />
          <Route path="/setup/:mobile" component={SetUp} />
          <Route path="/">
            <Redirect to="/home/:mobile" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}
function getStoreToken(store) {
  return {
    validTime: store.getValidTime
  }
}

function setStoreToken(dispatch) {
  return {
    setValidTime: (data) => {
      dispatch(data);
    }
  }
}

export default connect(getStoreToken, setStoreToken)(App);
