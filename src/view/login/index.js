// 项目登录页面
import React, { useState, useEffect } from 'react';
// 引入样式设置
import IndexCss from './index.module.scss';

import { Input, Row, Col, Select, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// 引入穿透样式
import "../../assets/login.module.scss";
// 
import { connect } from 'react-redux';
// 引入axios
import Axios from '../../utils/axios';
// 引入登录按钮
import { Buttons } from '../../component/button';

const { Option } = Select;

// 创建函数式组件
function Login(props) {
    // useEffect(() => {

    // })
    function typeLogin() {
        props.history.push("/register");
    }

    function forgetPassword() {
        props.history.push("/retrieve");
    }
    // console.log(props);
    return (<div className="login">
        <div>
            <img className="logins" src="http://localhost/login.jpg" alt="小熊官网" />
            <h1 style={{ color: "#fff", marginLeft: "10px" }}>小熊官网</h1>
            <LoginView forgetPassword={forgetPassword} />
            <NavLogin type="没有账号" typeLogin={typeLogin} />
        </div>
    </div>)
}




// 创建登录的input页面
export const LoginView = (props) => {
    // 控制着登录方式的变量
    const [loginType, setLoginType] = useState("账号密码登录");
    // 存储国家的地区代码
    const [nation, setNation] = useState([]);

    // 保存用户名的变量
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState(0);

    const [state, setState] = useState("");
    // 定义一个变量控制
    const [input, setInput] = useState(0);
    // 定义一个获取验证码的函数
    const [authCode, setAuthCode] = useState(0)

    function setLoginTypeFunc() {
        setInput(0)
        if (loginType === "账号密码登录") {
            setLoginType("手机验证码登录")
        } else {
            setLoginType("账号密码登录")
        }
    }

    function onFocus() {
        if (!nation.length) {
            Axios("/test/login").then((res) => {
                console.log(res);
                if (res.status === 1) {
                    setNation(res.data)
                }
            })
        }
    }
    // 选择国家触发的函数
    function nationSelect(v) {
        setState(v)
    }
    // 输入手机号码以及用户名触发的函数
    function usernameInput(v) {
        if (!v.target.value) {
            setInput(1)
        } else {
            setUsername(v.target.value);
        }
    }
    // 输入密码或者验证码触发的函数
    function PasswordInput(v) {
        if (!v.target.value && !username) {
            setInput(3)
        } else if (!v.target.value) {
            setInput(2)
        } else {
            setPassword(v.target.value);
        }
    }

    // 输入框输入用户名触发的函数
    function onChangeUsername(v) {
        if (!v.target.value && !password) {
            setInput(3)
        } else if (!v.target.value && !input === 3) {
            setInput(1)
        } else if (!password && input === 3) {
            setInput(2)
        } else {
            setInput(0)
        }
    }
    // 输入框输入密码触发的函数
    function onChangePassword(v) {
        if (!v.target.value && !username) {
            setInput(3)
        } else if (!v.target.value && !input === 3) {
            setInput(2)
        } else if (!username) {
            setInput(1)
        } else {
            setInput(0)
        }
    }



    function login() {
        if (!username && !password) {
            setInput(3);
        } else if (!username) {
            setInput(1);
        } else if (!password) {
            setInput(2);
        } else {
            console.log(username);
            console.log(password);
            console.log(state);
        }
    }
    // 验证码的倒计时函数
    useEffect(() => {
        if (authCode !== 0) {
            (setTimeout(() => {
                setAuthCode(authCode - 1)
            }, 1000))
        }
    }, [authCode])

    function getAuthCode() {
        if (!username) {
            setInput(1)
        } else if (authCode > 0) {
            message.warning("还剩" + authCode + "秒,才能再次发送短信！");
        } else {
            setAuthCode(60)
        }
    }
    console.log(props);
    return (<div className={IndexCss.loginView}>
        <ul>
            <li>
                <h2>小熊官网</h2><span>{loginType}</span><strong onClick={setLoginTypeFunc}>{loginType === "账号密码登录" ? "手机验证码登录" : "账号密码登录"}<i className="iconfont icon-jiantou"></i></strong>
            </li>
            <li>

                {loginType === "账号密码登录" ? <Input onBlur={usernameInput} onChange={onChangeUsername} size="default size" placeholder="请输入用户名登录" prefix={<UserOutlined />} /> :
                    <Input.Group size="large">
                        <Row gutter={0}>
                            <Col span={5}>
                                <div className="globalcss">
                                    <Select
                                        showSearch
                                        style={{ width: "100%" }}
                                        placeholder="86"
                                        optionFilterProp="children"
                                        onFocus={onFocus}
                                        onChange={nationSelect}
                                        filterOption={(input, option) =>
                                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {nation.map(v => {
                                            return <Option key={v.phone} value={v.phone}>{v.name}</Option>
                                        })}
                                    </Select>
                                </div>
                            </Col>
                            <Col span={19}>
                                <Input onBlur={usernameInput} onChange={onChangeUsername} style={{ height: "32px" }} />
                            </Col>
                        </Row>
                    </Input.Group>}
                {input === 1 || input === 3 ? <p>请输入{loginType === "账号密码登录" ? "账号" : "手机号码"}</p> : ""}
                {loginType === "账号密码登录" ? <Input.Password onBlur={PasswordInput} onChange={onChangePassword} style={{ marginTop: "20px" }} placeholder="请输入密码" onPressEnter={login} />
                    : <div className={IndexCss.authcode}><Input onBlur={PasswordInput} onChange={onChangePassword} /><button onClick={getAuthCode}>{authCode !== 0 ? authCode + "s" : "获取验证码"}</button></div>}
                {input === 2 || input === 3 ? <p>请输入{loginType === "账号密码登录" ? "密码" : "手机验证码"}</p> : ""}
            </li>
            <li>
                <Buttons disabled={true} onClicks={login} text="登录" />
            </li>
            <li onClick={() => props.forgetPassword()}>
                忘记密码？
            </li>
            <li>
            </li>
        </ul>
    </div>)
}

// 登录以及注册的导航
export const NavLogin = (props) => {
    console.log(props);
    return (
        <div className={IndexCss.typeLogin} onClick={() => props.typeLogin()}>
            {props.type} ?
        </div>
    )
}

// 取出redux的token数据
function getStoreToken(store) {
    return {
        store: store
    }
}


export default connect(getStoreToken, null)(Login);