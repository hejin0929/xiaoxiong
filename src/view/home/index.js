// 项目首页
import React, { useEffect, useState } from 'react';
import Axios from '../../utils/axios';
import { connect } from 'react-redux';
// 引入头部组件
import Header from '../../component/header';
// 引入样式
import IndexCss from './index.module.scss';

import Lobby from '../lobby';


function Home(props) {

    const [nav, setNav] = useState(0)
    // console.log(props);
    // 这个函数是查询用户超时间没请求，就判断其退出登陆，将发送一个请求让路由拦截
    useEffect(() => {
        if (localStorage.getItem("token")){
            var interval = setInterval(() => {
                Axios("/test/home");
                window.clearInterval(interval);
            }, props.validTime * 1000);

        }
        return () => {
            window.clearInterval(interval);
        }
    }, [props.validTime]);

    const siginTitle = localStorage.getItem("token") ? ["首页大厅", "好友星球", "好友列表", "好友聊天", "同城玩乐", "音乐世界"] : ["地球村", "同城玩乐", "音乐世界"];

    function routerPush() {
        if (props.history.location.search || props.history.location.pathname) {
            let url = props.history.location.search.split("=")[1] || props.history.location.pathname.split("=")[1];
            props.history.push("/setup/mobile=" + url);
        } else {
            props.history.push("/login");
        }
    }

    // 点击导航标题触发的函数
    function handleNavClick(v) {
        setNav(v);
    }

    return (<div className={IndexCss.homeBox}>
        <Header routerPush={routerPush} history={props.history} title={<><i style={{ marginRight: "5px" }} className="iconfont icon-shezhi"></i>设置</>} />
        <div className={IndexCss.homeBoxConnter}>
            <div className={IndexCss.nav}>
                {/* <Search allowClear={true} placeholder="请输入商品进行搜索" onSearch={value => console.log(value)} enterButton="搜索" /> */}
                <ul>
                    {siginTitle.map((v, i) => {
                        return (<li key={i} className={nav === i ? IndexCss.navActivate : ""} onClick={() => handleNavClick(i)}>
                            {v}
                        </li>)
                    })}
                </ul>
            </div>
            <div className={IndexCss.Slideshow}>
                <Lobby />
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