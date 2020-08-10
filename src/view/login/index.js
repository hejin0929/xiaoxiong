// 项目登录页面
import React, { useState } from 'react';
// 引入样式设置
import IndexCss from './index.module.scss';

import { Input, Row, Col, Select, message, Spin } from 'antd';
import { UserOutlined } from '@ant-design/icons';
// 引入穿透样式
import "../../assets/login.module.scss";
// 引入axios
import Axios from '../../utils/axios';
// 引入登录按钮
import { Buttons, AuthCodeBtu } from '../../component/button';

const { Option } = Select;

// 创建函数式组件
function Login(props) {
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
            <LoginView forgetPassword={forgetPassword} history={props.history} setToken={props.setToken} />
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
    const [authCode, setAuthCode] = useState("");
    // 加载状态的控制变量
    const [spinning, setSpinning] = useState(false);

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
        setState(v);
        console.log(state);
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
        setUsername(v.target.value)
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

    // 创建一个定时器轮询，查看token是否存入成功



    function login() {
        if (!username && !password) {
            setInput(3);
        } else if (!username) {
            setInput(1);
        } else if (!password) {
            setInput(2);
        } else {
            if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password) && loginType === "账号密码登录") {
                message.warning("密码必须为6-16位的字母以及数字组成");
            } else {
                // 对登录方式判断 是验证码的方式还是账号密码的方式
                if (loginType === "账号密码登录") {
                    setSpinning(true)
                    Axios("/test/sign_in", { mobile: username, password }).then((res) => {
                        if (res.status === 1) {
                            localStorage.setItem("token", res.data);
                            setTimeout(() => {
                                setSpinning(false)
                                message.success(res.info);
                                props.history.push("/home?mobile=" + username);
                                localStorage.setItem("user",username);
                            }, 1100)
                        } else {
                            message.warning(res.info);
                        }
                        setSpinning(false)
                    });
                } else {
                    setSpinning(true)
                    if (password === authCode) {
                        Axios("/test/sign_in").then((res) => {
                            localStorage.setItem("token", res.data);
                            if (res.status === 1) {
                                setSpinning(false);
                                props.history.push("/home?mobile=" + username);
                                localStorage.setItem("user",username);
                            }
                        })
                    } else {
                        message.warning("验证码输入错误!");
                        setSpinning(false);
                    }
                }
            }
        }
    }

    function getAuthCode() {
        Axios("/test/get_code?mobile=" + username).then((res) => {
            if (res.status === 1) {
                setAuthCode(res.info)
                localStorage.setItem("token", res.data);
            } else {
                message.warning(res.info);
            }
        })
    }
    return (<div className={IndexCss.loginView}>
        <Spin tip="Loading..." spinning={spinning}>
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
                        : <div className={IndexCss.authcode}><Input onBlur={PasswordInput} onChange={onChangePassword} /><AuthCodeBtu username={username} onclickCode={getAuthCode} /></div>}
                    {input === 2 || input === 3 ? <p>请输入{loginType === "账号密码登录" ? "密码" : "手机验证码"}</p> : ""}
                </li>
                <li>
                    <Buttons disabled={true} onClicks={login} text="登录" />
                </li>
                {loginType === "账号密码登录" ? <li onClick={() => props.forgetPassword()}>
                    忘记密码？
            </li> : <li style={{ color: "#1c9851" }}>
                        {authCode && "验证码为：" + authCode}
                    </li>}

                <li>
                </li>
            </ul>
        </Spin>
    </div>)
}

// 登录以及注册的导航
export const NavLogin = (props) => {

    return (
        <div className={IndexCss.typeLogin} onClick={() => props.typeLogin()}>
            {props.type} ?
        </div>
    )
}

export default Login;