import React from 'react';

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


function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/index" component={Home} />
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

export default App;
