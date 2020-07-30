// 页面组件头部模块
import React, { useEffect, useState } from 'react';
import IndexCss from './index.module.scss';

function Header(props) {
    // 设置一个变量判断用户是否是登陆状态
    const [inSgin, setInSgin] = useState("");

    useEffect(() => {
        if (localStorage.getItem("token")) {
            setInSgin(1)
        }
    }, [inSgin])

    console.log();

    function SetUpPush() {
        console.log(props);
        props.history.push("/setup/mobile=" + props.history.location.search.split("=")[1]);
        // props.history.push("/setup");
    }

    return (<div className={IndexCss.header}>
        <div className={IndexCss.HeaderLeft}>
            <h2>欢迎来到小熊官网</h2>
            {inSgin ? <span><i className="iconfont icon-renyuan"></i>{props.history.location.search.split("=")[1]}</span> : <a href="#/login">去登录?</a>}
        </div>
        <div className={IndexCss.HeaderRigth}>
            {inSgin && <span onClick={SetUpPush}><i style={{ marginRight: "5px" }} className="iconfont icon-shezhi"></i>设置</span>}
        </div>
    </div>)
}

export default Header;