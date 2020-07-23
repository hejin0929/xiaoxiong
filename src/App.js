import React from 'react';

// 引入Login页面
import Login from './view/login';
// 引入首页
import Home from './view/home';

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
          <Route path="/">
            <Redirect to="/login" />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
