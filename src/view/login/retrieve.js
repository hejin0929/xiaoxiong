// 这是项目找回密码页面
import React, { useState } from 'react';
import { NavLogin } from './index';
import { Steps, Input, message } from 'antd';
import { Buttons, AuthCodeBtu } from '../../component/button';
import Axios from '../../utils/axios';

import IndexCss from './index.module.scss';

export default function Retrieve(props) {

    const [current, setCurrent] = useState(0);
    const [mobile, setMobile] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [aCode, setaCode] = useState("")

    function typeLogin() {
        props.history.push("/login");
    }

    function onChangeMobile(v) {
        setErr("")
        if (current === 0) {
            setMobile(v.target.value);
        } else if (current === 1) {
            setCode(v.target.value);
        } else if (current === 2) {
            setPassword(v.target.value);
        }
    }
    // 点击下一步触发的函数
    function nextStep() {
        if (current === 0) {
            console.log(mobile);
            if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                message.warning("手机号码有误！请重填")
                return false;
            } else {
                setCurrent(1);
            }
        } else if (current === 1) {
            if (!code) {
                setErr("验证码");
            } else {
                if (code === aCode) {
                    setCurrent(current + 1);
                } else {
                    message.warning("输入的验证码不对，请重新输入")
                }
            }
        } else if (current === 2) {
            if (!password) {
                setErr("密码");
            } else {
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
            }
        }else if (current === 3) {
            props.history.push("/login");
        }
    }
    function onclickCode() {
        Axios("/test/get_code?mobile=" + mobile).then((res) => {
            if (res.status === 1) {
                setaCode(res.info)
            }
        })
    }

    return (<div className={IndexCss.retrieve}>
        <img className="logins" src="http://jgnb.8li0.com/login.jpg" alt="小熊官网" />
        <NavLogin type="去登录" typeLogin={typeLogin} />
        <div className={IndexCss.progress}>
            <Steps current={current}>
                <Steps.Step title="手机号验证" icon={<i className="iconfont icon-shoujiyanzheng"></i>} />
                <Steps.Step title="获取验证码" icon={<i className="iconfont icon-mima"></i>} />
                <Steps.Step title="重置密码" icon={<i className="iconfont icon-shezhimima"></i>} />
                <Steps.Step title="找回成功" icon={<i className="iconfont icon-zhucechenggong"></i>} />
            </Steps>

            <ul>
                {current > 0 && <li><strong>{mobile}</strong></li>}
                <li>
                    <div className={IndexCss.Input}>
                        {current === 1 && <Input placeholder="请输入手机验证码" onChange={onChangeMobile} />}
                        {current === 2 && <Input.Password placeholder="请设置密码" onChange={onChangeMobile} />}
                        {!current && <Input placeholder="请输入手机号码" onChange={onChangeMobile} />}
                        {current === 1 && <AuthCodeBtu username={mobile} onclickCode={onclickCode} />}
                    </div>
                    {err && <p className={IndexCss.err}>请输入你的{err}</p>}
                </li>

                <li><Buttons disabled={mobile ? true : false} onClicks={nextStep} text="下一步" /></li>
                {aCode && current === 1 && <span style={{ color: "green" }}>验证码为<strong>{aCode}</strong></span>}
            </ul>
        </div>
    </div>)
}