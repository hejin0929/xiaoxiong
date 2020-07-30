// 项目的设置页面
import React, { useState, useEffect, useRef } from 'react';
import { Spin, Tabs, message } from 'antd';
// 引入样式
import IndexCss from './index.module.scss';

import Axios from '../../utils/axios';
const { TabPane } = Tabs;

// 导出函数组件
export default function SetUp(props) {
    const [data, setData] = useState("");
    useEffect(() => {
        // console.log(props.history.location);
        Axios("test/home/setup?mobile=" + props.history.location.pathname.split("=")[1]).then((res) => {
            console.log(res);
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
    return (<div>
        <Spin tip="Loading..." spinning={!data ? true : false}>
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
                        <TabPane tab="账号设置" key="2">
                            Content of Tab Pane 2
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
        props.setMessagePremise()
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
            <div className={IndexCss.btu}>
                <input className={IndexCss.submit} type="submit" />
                <input className={IndexCss.cancel} type="reset" />
            </div>
        </form>
    </div>)
}