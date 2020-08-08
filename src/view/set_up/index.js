// 项目的设置页面
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Tabs, message, Steps, Input, Result } from 'antd';
// 引入样式
import IndexCss from './index.module.scss';

import Axios from '../../utils/axios';
import Header from '../../component/header';
import { Buttons, AuthCodeBtu } from '../../component/button';
// 引入from按钮
import {FromBut} from '../../component/button';
const { TabPane } = Tabs;

// 导出函数组件
export default function SetUp(props) {
    const [data, setData] = useState("");
    useEffect(() => {
        // console.log(props.history.location);
        Axios("test/home/setup?mobile=" + props.history.location.pathname.split("=")[1]).then((res) => {
            if (res.status === 1) {
                setData(res.data)
            }
        })
        return () => {

        }
    }, [props.history.location.pathname])

    function callback(v) {
        console.log(v);
    }

    function setMessagePremise() {
        setData(false);
    }

    function setMessage(data) {
        setData(data)
    }
    function routerPush() {
        props.history.push("/home/mobile=" + props.history.location.pathname.split("=")[1]);
    }


    return (<div>
        <Spin tip="Loading..." spinning={!data ? true : false}>
            <Header history={props.history} routerPush={() => routerPush()} title={<><i style={{ marginRight: "5px" }} className="iconfont icon-caidan" />首页</>} />
            <div className={IndexCss.setupBox}>
                <div className={IndexCss.title}>
                    <img src={data.icon} alt="头像" />
                    <h2>个人中心</h2>
                </div>
                <div>
                    <Tabs defaultActiveKey="1" onChange={callback}>
                        <TabPane tab="个人资料" key="1">
                            {data && <PersonalData data={data} setMessagePremise={setMessagePremise} setMessage={setMessage} />}
                        </TabPane>
                        <TabPane tab="手机换绑" key="2">
                            <IdSet history={props.history} />
                        </TabPane>
                        <TabPane tab="重置密码" key="3">
                            <SetPass history={props.history} />
                        </TabPane>
                    </Tabs>
                </div>
            </div>
        </Spin>
    </div>)
}


// 个人资料组件
function PersonalData(props) {
    const upload = useRef("");

    const can = useRef("");

    const [image, setImage] = useState("")

    function onSubmit(e) {
        e.preventDefault();
        let formData = new FormData(upload.current);
        let imgName = formData.get("image");

        let obj = {}
        obj.mobile = props.data.mobile;
        obj.user_name = formData.get("user_name");
        obj.message = formData.get("message");
        obj.email = formData.get("email");
        obj.image = image;
        obj.icon = imgName.name;
        props.setMessagePremise();
        Axios("/test/home/upload/head_portrait", obj).then((res) => {
            if (res.status === 1) {
                props.setMessage(res.data)
            }
        })
    }

    function onChange() {
        let formData = new FormData(upload.current);
        let file = new FileReader();

        file.readAsDataURL(formData.get("image"));

        let image = formData.get("image");  // name

        if (image.name.indexOf(".jpg") !== -1) {
            file.onload = function (e) {
                var e1 = window.event || e;
                var imgFile = e1.target.result;

                var img1 = new Image();
                img1.src = imgFile;
                setImage(imgFile);
                img1.onload = function () {
                    var myContext = can.current.getContext("2d"); //将getContext 应用到 canvas 元素
                    myContext.drawImage(img1, 0, 0, 100, 100);
                }
            };
        } else {
            message.warning("只支持上传jpg类型的图片");
        }

    }
    // console.log(props.data);
    return (<div className={IndexCss.upload}>
        <form className={IndexCss.form} encType="multipart/form-data" ref={upload} method="post" onSubmit={onSubmit}>
            <ul>
                <li>
                    <label>更换头像</label> <input className={IndexCss.canvasInp} type="file" placeholder="请上传图片" name="image" onChange={onChange} />
                    <div className={IndexCss.canvas}>
                        {!image && <i className="iconfont icon-tubiaolunkuo-" />}
                        <canvas ref={can}></canvas>
                    </div>
                </li>
                <li>
                    <label>手机号</label><input name="mobile" type="text" disabled={true} defaultValue={props.data.mobile} />
                </li>
                <li>
                    <label>呢称</label><input name="user_name" type="text" defaultValue={props.data.user_name} />
                </li>
                <li>
                    <label>个人介绍</label><textarea name="message" rows="5" defaultValue={props.data.message} />
                </li>
                <li>
                    <label>联系邮箱</label><input name="email" type="text" defaultValue={props.data.email} />
                </li>
            </ul>
            <FromBut/>
        </form>
    </div>)
}

// 账号设置的页面组件
function IdSet(props) {
    const [current, setCurrent] = useState(0);

    const [inputPlac, setInputPlac] = useState("请输入旧手机号码");
    const [mobile, setMobile] = useState(props.history.location.pathname.split("=")[1]);
    const [code, setCode] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [newMobile, setNewMobile] = useState("");
    // 输入手机号码的函数
    function handleInput(v) {
        if (current === 2) {
            setNewMobile(v.target.value);
        } else {
            setMobile(v.target.value);
        }
    }

    // 进度条的判断
    function onClicks() {
        switch (current) {
            case 0:
                if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                    message.warning("手机号码有误！请重填");
                    return false;
                } else {
                    setCurrent(current + 1);
                }
                break;

            case 1:
                if (codeInput === code) {
                    setCurrent(current + 1);
                    setInputPlac("请输入新的手机号码");
                    setCode("");
                } else {
                    message.warning("验证码输入不正确");
                }
                break;

            case 2:
                if (!(/^1[3456789]\d{9}$/.test(mobile))) {
                    message.warning("手机号码有误！请重填");
                    return false;
                } else {
                    setCurrent(current + 1);
                }
                break;
            case 3:
                if (codeInput === code) {
                    Axios(`/test/replace_mobile?mobile=${mobile}&new_mobile=${newMobile}`).then((res) => {
                        if (res.status === 1) {
                            message.success(res.info);
                            setCurrent(current + 1);
                        }
                    })
                    setCode("");
                } else {
                    message.warning("验证码输入不正确");
                }
                break;

            default:
                props.history.push("/login")
                break;
        }
    }
    // 验证码的获取验证
    async function onclickCode() {
        let res = await Axios("/test/get_code?mobile=" + mobile);
        // console.log(res);
        if (res.status === 1) {
            setCode(res.info);
        } else {
            message.warning("号码不匹配");
        }
    }
    // 输入验证码的函数
    function SetCodeInputValue(v) {
        setCodeInput(v.target.value);
    }


    return (<div className={IndexCss.idSet}>
        <div>
            <span>手机号换绑</span>
            <div className={IndexCss.steps}>
                <Steps current={current}>
                    <Steps.Step title="原手机号" icon={<i className="iconfont icon-shoujihaoma"></i>} />
                    <Steps.Step title="输入验证码" icon={<i className="iconfont icon-mima"></i>} />
                    <Steps.Step title="新手机号" icon={<i className="iconfont icon-shoujihaoma"></i>} />
                    <Steps.Step title="输入验证码" icon={<i className="iconfont icon-mima"></i>} />
                    <Steps.Step title="绑定成功" icon={<i className="iconfont icon-zhucechenggong"></i>} />
                </Steps>
            </div>
            <div className={IndexCss.from}>
                {(current === 0 || current === 2) && <Input placeholder={inputPlac} style={{ margin: "20px 0" }} onChange={handleInput} value={current === 2 ? newMobile : mobile} />}
                {(current === 1 || current === 3) && <div className={IndexCss.authCode}>
                    <Input onChange={SetCodeInputValue} /><AuthCodeBtu username={current === 2 ? newMobile : mobile} onclickCode={onclickCode} />
                </div>}
                {current === 4 && <Result status="success" />}
                <Buttons disabled={true} onClicks={onClicks} text={current === 4 ? "完成" : "下一步"} />
                <span style={{ color: "green" }}>{code}</span>
            </div>
        </div>
    </div>)
}


// 修改密码
function SetPass(props) {

    const [data, setData] = useState({});
    const [Loding, setLoding] = useState(false)

    // 修改密码的确认按钮
    async function SetPassword() {
        if (data.newPassword !== data.newPassword_2) {
            message.warning("两次新密码不一致")
        } else if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/.test(data.newPassword_2)) {
            message.warning("密码必须为6-16位的字母以及数字组成");
        } else {
            setLoding(true)
            let res = await Axios(`/test/amend_password?old_password=${data.oldPassword}&new_password=${data.newPassword_2}&mobile=${props.history.location.pathname.split("=")[1]}`);
            
            setLoding(false);
            if (res.status === 1) {
                props.history.push("/login");
                message.success(res.info);
            }else{
                message.warning(res.info);
            }
        }
    }

    function handleChangeInp1(v) {
        data.oldPassword = v.target.value;
        setData(data);
    }
    function handleChangeInp2(v) {
        data.newPassword = v.target.value;
        setData(data);
    }
    function handleChangeInp3(v) {
        data.newPassword_2 = v.target.value;
        setData(data);
    }
    return (
        <div className={IndexCss.setPassword}>
            <span>更换密码</span>
            <Spin tip="Loading..." spinning={Loding}>
                <ul>
                    <li><label>旧密码</label><Input.Password onChange={handleChangeInp1} /></li>
                    <li><label>新密码</label><Input.Password onChange={handleChangeInp2} /></li>
                    <li><label>确认新密码</label><Input.Password onChange={handleChangeInp3} /></li>
                    <li>
                        <Buttons disabled={true} onClicks={SetPassword} text="提交" />
                    </li>
                </ul>
            </Spin>
        </div>
    )
}