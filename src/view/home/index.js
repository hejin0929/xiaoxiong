// 项目首页
import React, { useEffect } from 'react';
import Axios from '../../utils/axios';
import { connect } from 'react-redux';
// 引入头部组件
import Header from '../../component/header';
import { Input, Carousel } from 'antd';
// 引入样式
import IndexCss from './index.module.scss'

const { Search } = Input;
function Home(props) {
    // console.log(props);
    // 这个函数是查询用户超时间没请求，就判断其退出登陆，将发送一个请求让路由拦截
    // useEffect(() => {
    //     var interval = setInterval(() => {
    //         Axios("/test/home");
    //         window.clearInterval(interval);
    //     }, props.validTime  * 1000)

    //     return () => {
    //         window.clearInterval(interval);
    //     }
    // }, [props.validTime]);

    function onChange(params) {

    }

    return (<div className={IndexCss.homeBox}>
        <Header history={props.history} />
        <div className={IndexCss.homeBoxConnter}>
            <div className={IndexCss.nav}>
                {/* <Search allowClear={true} placeholder="请输入商品进行搜索" onSearch={value => console.log(value)} enterButton="搜索" /> */}
                <ul>
                    <li>地球村</li>
                    {localStorage.getItem("token") && <><li>好友星球</li>
                        <li>好友列表</li>
                        <li>好友聊天</li></>}
                    <li>同城玩乐</li>
                    <li>音乐世界</li>
                </ul>
            </div>
            <div className={IndexCss.Slideshow}>
                123
            </div>
        </div>
    </div>)
}

function getStoreValidTime(store) {
    return {
        validTime: store.getValidTime
    }
}


export default connect(getStoreValidTime, null)(Home);