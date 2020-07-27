import React, { useState } from 'react';

// 引入登录导航区
import { NavLogin } from './index';
import { Steps, Input, message } from 'antd';

import IndexCss from './index.module.scss';
// 引入按钮组件
import { Buttons, AuthCodeBtu } from '../../component/button';
import Axios from '../../utils/axios';

export default function Register(props) {

    const [mobile, setMolie] = useState("");
    const [warning, setWarning] = useState(0);
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    // 添加一个计算步骤条的状态
    const [current, setCurrent] = useState(0);
    // 后端返回的验证码储存变量
    const [aCode, setACode] = useState("");

    function typeLogin() {
        props.history.push("/login");
    }

    function onclickCode() {
        if (!mobile) {
            setWarning(1);
        } else {
            if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                message.warning("手机号码有误！请重填")
                return false;
            } else {
                setACode("");
                Axios("/test/get_authCode?mobile=" + mobile).then((res) => {
                    if (res.status === 1) {
                        setACode(res.info);
                        setCurrent(1);
                    } else {
                        message.warning("该手机号码已注册");
                    }
                });
            }
        }
    }

    function onChangeMobile(v) {
        setMolie(v.target.value);
    }

    function onChangeCode(v) {
        if (current > 1) {
            setPassword(v.target.value);
        } else {
            setCode(v.target.value);
        }
    }

    function onChangeInput(v) {
        setMolie(v.target.value);
        if (current >= 2) {
            setCurrent(1);
            setACode("");
        }
        if (!v.target.value && !code) {
            setWarning(1);
        } else {
            setWarning(0);
        }
    }

    function onChangeInput1(v) {
        if (!v.target.value && !mobile) {
            setWarning(3)
        } else if (!v.target.value && !warning === 3) {
            setWarning(2)
        } else if (!mobile) {
            setWarning(1)
        } else {
            setWarning(0)
        }
    }
    function onRegister() {
        if (!mobile && !code) {
            setWarning(3);
        } else if (!mobile) {
            setWarning(1);
        } else if (current > 1 ? !password : !code) {
            setWarning(2);
        } else {
            if (current === 2) {
                if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(password)) {
                    message.warning("密码必须为6-16位的字母以及数字组成");
                } else {
                    Axios("/test/set_password", { password, mobile }).then((res) => {
                        if (res.status === 1) {
                            setCurrent(current + 1);
                            message.success(res.info);
                        }
                    })
                }
            } else if (current === 1) {
                if (code === aCode) {
                    setCurrent(current + 1);
                } else {
                    message.warning("验证码输入不正确！请重新输入。");
                }
            } else if (current === 0 && aCode !== "") {
                setCurrent(current + 1);
            } else if (current === 3) {
                props.history.push("/login");
            }
        }
    }



    return (<div className={IndexCss.register}>
        <img className="logins" src="http://localhost/login.jpg" alt="小熊官网" />
        <NavLogin type="已有账号" typeLogin={typeLogin} />
        <div className={IndexCss.progress}>
            <Steps current={current}>
                <Steps.Step title="手机号注册" icon={<i className="iconfont icon-shoujihaoma"></i>} />
                <Steps.Step title="输入验证码" icon={<i className="iconfont icon-mima"></i>} />
                <Steps.Step title="设置密码" icon={<i className="iconfont icon-shezhimima"></i>} />
                <Steps.Step title="注册成功" icon={<i className="iconfont icon-zhucechenggong"></i>} />
            </Steps>
            <div className={IndexCss.registerFrom}>
                <ul>
                    <li>
                        <Input placeholder="请输入手机号码" onBlur={onChangeMobile} onChange={onChangeInput} />
                        {warning === 1 || warning === 3 ? <p>请输入手机号码</p> : ""}
                    </li>
                    <li>
                        {current < 2 ? <div><Input placeholder="请输入验证码" onBlur={onChangeCode} onChange={onChangeInput1} /><AuthCodeBtu current={current} username={mobile} onclickCode={onclickCode} /></div>
                            : <Input.Password onBlur={onChangeCode} onChange={onChangeInput1} style={{ marginTop: "20px" }} placeholder="请输入密码" onPressEnter={onRegister} />}
                        {warning === 2 || warning === 3 ? <p> {current > 1 ? "请设置密码" : "请输入手机验证码"}</p> : ""}
                    </li>
                    <li>
                        <Buttons disabled={current > 0} text={current === 2 ? "注册" : "确定"} onClicks={onRegister} />
                    </li>
                </ul>
                {aCode && current === 1 && <span style={{ color: "green" }}>验证码为<strong>{aCode}</strong></span>}
            </div>
        </div>
    </div>)
}