import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'antd/dist/antd.css';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import './index.css';

// 引入redux的标签
import { Provider } from 'react-redux';
import { store } from './utils/redux';

ReactDOM.render(
  <Provider store={store}><ConfigProvider locale={zhCN}> <App /> </ConfigProvider></Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
