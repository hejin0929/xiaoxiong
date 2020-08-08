// 项目的按钮组件
import React, { useState, useEffect } from 'react';
import IndexCss from './index.module.scss';
import { message } from 'antd';

export const Buttons = (props) => {
    function Click() {
        if (props.disabled) {
            props.onClicks()
        }
    }
    return (<>
        <button className={props.disabled ? IndexCss.But : IndexCss.ButDis} onClick={Click}>{props.text}</button>
    </>)
}


export function AuthCodeBtu(props) {
    // 定义一个获取验证码的函数
    const [authCode, setAuthCode] = useState(0);
    // 储存手机号码得值
    const [mobile, setMobile] = useState("");

    // 验证码的倒计时函数
    useEffect(() => {
        if (authCode !== 0) {
            var interval = setInterval(() => {
                setAuthCode(authCode - 1);
                window.clearInterval(interval)
            }, 1000)
        }
        return () => {
            if (props.username !== mobile && authCode > 0) {
                window.clearInterval(interval)
                setAuthCode(0)
            }
        }
    }, [authCode, props.username, mobile])

    function getAuthCode() {
        if (authCode > 0) {
            message.warning("还剩" + authCode + "秒,才能再次发送短信！");
            // setAuthCode(0)
        } else {
            if (!(/^1[3456789]\d{9}$/.test(props.username))) {
                message.warning("手机号码有误！请重填")
                return false;
            } else {
                props.onclickCode()
                if (props.username) {
                    setAuthCode(60);
                    setMobile(props.username);
                }
            }
        }
    }
    return (<>
        <button className={IndexCss.codeBut} onClick={getAuthCode}>{authCode !== 0 ? authCode + "s" : "获取验证码"}</button>
    </>)
};


// 创建一个from表单的按钮
export const FromBut = (props) => {
    return (<div className={IndexCss.btu}>
        <input className={IndexCss.submit} type="submit" value={props.submit} />
        <input  onClick={()=> props.resetClick()} className={IndexCss.cancel} type="button" value={props.reset || "取消"} />
    </div>)
}