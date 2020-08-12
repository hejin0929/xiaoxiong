// 项目的axios请求封装

// 引入axios 
import axios from 'axios';


// 添加axios的基地址
// axios.defaults.baseURL = 'demo01.nextsls';

import { store } from '../redux';
// 添加基地址
axios.defaults.baseURL = "http://jgnb.8li0.com";

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // console.log(config);
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    var token = store.getState();
    if (token.validTime <= 0) {
        localStorage.removeItem("token");
        store.dispatch({ type: "clearToken" });
    }
    
    const url = response.config.url;
    var getUrl = -1;

    getUrl = url.indexOf("/test/home");
    var home = url.indexOf("/test/home/get_home");
    if(home === 0){
        getUrl = -1
    }
    
    if (getUrl !== -1) {
        store.dispatch({ type: "activate" });
        if (token.getToken === null || token.getToken === "null") {
            // alert("堵住")
            window.location.href = "/";
        }
    } else {
        store.dispatch({ type: "activate" });
    }

    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
});


// 创建一个Axios函数并导出
export default function Axios(url, data) {
    return new Promise((resolve, reject) => {
        if (data) {
            axios.post(url, data).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
        } else {
            // 请求失败再发送一次请求
            axios.get(url).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                console.log(err);
                reject(err)
            })
        }
    })
}