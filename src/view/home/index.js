// 项目首页
import React, { useEffect } from 'react';
import Axios from '../../utils/axios';
import { connect } from 'react-redux';

function Home(props) {
    // console.log(props);
    // 这个函数是查询用户超时间没请求，就判断其退出登陆，将发送一个请求让路由拦截
    useEffect(() => {
        var interval = setInterval(() => {
            Axios("/test/home");
            window.clearInterval(interval);
        }, props.validTime  * 1000)

        return () => {
            window.clearInterval(interval);
        }
    }, [props.validTime]);


    
    function click() {
        Axios("/test/home");
    }
    return (<div>
        <button onClick={click}>导航守卫点我进行守卫</button>
    </div>)
}

function getStoreValidTime(store) {
    return {
        validTime : store.getValidTime
    }
}


export default connect(getStoreValidTime, null)(Home);