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

// 引入路由
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';


function App(props) {

  useEffect(() => {
    if (props.validTime >= 0) {
      // console.log(props.validTime);
      var interval = setInterval(() => {
        props.setValidTime({ type: "setValidTime" });
        window.clearInterval(interval);
      }, 1000)
    }
    return () => {
      window.clearInterval(interval);
      if (props.validTime <= 1) {
        localStorage.setItem("token", null);
      }
    }
  }, [props, props.validTime])

  useEffect(() => {
    props.setValidTime({ type: "refresh" });
  },[props])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/retrieve" component={Retrieve} />
          <Route path="/">
            <Redirect to="/login" />
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
