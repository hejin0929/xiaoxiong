// 展览大厅页面
import React, { useState, useEffect } from 'react';

import IndexCss from './index.module.scss';

import { Drawer, message, Spin } from 'antd';

import AddArticle from './addArticle';

// 引入Axios请求
import Axios from '../../utils/axios';

// 引入moment格式化日期
import moment from 'moment';

function Lobby() {
    const [visible, setVisible] = useState(false);

    // 创建一个变量接受数据
    const [data, setData] = useState([]);

    function onClose() {
        setVisible(false)
    }

    function handleDrawer(params) {
        setVisible(true)
    }

    // 初次渲染页面时触发的函数
    useEffect(() => {
        // if (localStorage.getItem("token")) {
        Axios("/test/home/get_home?id=" + localStorage.getItem("user") || 0).then((res) => {
            console.log(res);
            if (res.status) {
                setData(res.data === null ? [] : res.data);
            } else {
                message.error(res.info);
            }
        })
        // }
    }, [])

    return (<Spin tip="Loading..." spinning={!data.length ? true : false}><div className={IndexCss.lobby}>
        <div className={IndexCss.title}>
            <div className={IndexCss.write} onClick={handleDrawer}>
                <i className="iconfont icon-pen" />写攻咯?
            </div>
            <div className={IndexCss.filtrate}>
                <ul>
                    <li>最新瞬间</li>
                    <li>热门瞬间</li>
                    <li>推荐瞬间</li>
                </ul>
            </div>
        </div>

        <div className={IndexCss.articleBox}>
            {data.map((v, i) => {
                return <Template data={v} key={i} />
            })}
        </div>

        <Drawer
            title="写瞬间"
            placement="right"
            onClose={onClose}
            visible={visible}
            width="80%"
        >
            <AddArticle CloseDrawer={onClose} />
        </Drawer>
    </div></Spin>)
}

// 展示个人瞬间的模板
function Template(props) {
    let data = props.data;
    let date = moment(new Date().getTime()).format('YYYY-MM-DD HH:mm:ss');
    return (<div className={IndexCss.template}>
        <div className={IndexCss.header}>
            <img className={IndexCss.headerImg} src="http://jgnb.8li0.com/TYw1wIkEzd.jpg" alt="头像" />
            <div className={IndexCss.message}>
                <header>{data.title}</header>
                <p>
                    <span><i className="iconfont icon-renyuan" />{data.uid.username || data.uid.mobile}</span><span><i className="iconfont icon-time" />{date}</span>
                    <span><i className="iconfont icon-liulan" />{data.appraise}</span>
                </p>
            </div>
        </div>
        <div className={IndexCss.contentBox}>
            <p>{data.content}</p>
            {data.image && <div className={IndexCss.imageList}>
                {data.image.map((v, i) => {
                    return <div key={i} className={IndexCss.imgBox}>
                        <img src={v} alt={i} />
                    </div>
                })}
            </div>}
            <div className={IndexCss.appraise}> <i className="iconfont icon-pinglun" /><span>0条</span><p>查看评论</p></div>
        </div>
    </div>)
}

export default Lobby;