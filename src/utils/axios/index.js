// 项目的axios请求封装

// 引入axios 
import axios from 'axios';


// 添加axios的基地址
// axios.defaults.baseURL = 'demo01.nextsls';

// import { store } from '../../../redux';
// 添加基地址
// axios.defaults.baseURL = "http://127.0.0.1:8888";

// 添加请求拦截器
// axios.interceptors.request.use(function (config) {
//     return config;
// }, function (error) {
//     // 对请求错误做些什么
//     return Promise.reject(error);
// });

// // 添加响应拦截器
// axios.interceptors.response.use(function (response) {
//     // console.log(response.config.url);
//     if (response.config.url !== "/rest/account/login") {

//         let res = ''
//         res = store.getState()
//         // console.log(res);
//         if (res.session_id === '') {
//             window.location.href = "/"
//         } else if (res === '') {
//             window.location.href = "/"
//         }
//     }
//     // 对响应数据做点什么
//     return response;
// }, function (error) {
//     // 对响应错误做点什么
//     return Promise.reject(error);
// });


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
            axios.get(url).then((res) => {
                resolve(res.data)
            }).catch((err) => {
                reject(err)
            })
        }
    })
}