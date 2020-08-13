// 展览大厅页面
import React, { useState, useEffect, useContext } from 'react';

import IndexCss from './index.module.scss';

import { Drawer, message, Spin } from 'antd';

import AddArticle from './addArticle';

// 引入Axios请求
import Axios from '../../utils/axios';

// 引入moment格式化日期
import moment from 'moment';

// 引入评价输入框和按钮
import CommentInputAndBut from '../../component/comment';

const context = React.createContext({ name: "" })

function Lobby(props) {
    const [visible, setVisible] = useState(false);

    // 创建一个变量接受数据
    const [data, setData] = useState([]);

    // 创建一个共享数据
    const context1 = useContext(context)

    function onClose() {
        setData([])
        setVisible(false)
    }

    // 当用户点击发布瞬间时判断是否登录 没有则跳到登录页面
    function handleDrawer() {
        context1.name();
        setVisible(true);
    }

    // 判断用户是否登录
    function inLogin() {
        if (!localStorage.getItem("token")) {
            props.history.push("/login");
        }
    }
    context1.name = inLogin;

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
    }, [visible])


    // 更新瞬间的函数
    function UpdateComment(v) {
        console.log(v);
        data[v.item] = v.data;
        setData([...data]);
    }

    return (<Spin tip="Loading..." spinning={!data.length ? true : false}><div className={IndexCss.lobby}>
        <div className={IndexCss.title}>
            <div className={IndexCss.write} onClick={handleDrawer}>
                <i className="iconfont icon-pen" />发布瞬间?
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
                return <Template UpdateComment={UpdateComment} data={v} item={i} key={i} />
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
    // 共享了一个context数据 .name为一个判断用户是否有登录的函数
    const context1 = useContext(context);
    // 创建一个变量控制加载状态
    const [loading, setLoading] = useState(false)

    // 创建一个评论数据
    const [appraise, setAppraise] = useState([])

    let data = props.data;
    let date = moment(data.created * 1000).format('YYYY-MM-DD HH:mm:ss');
    // 创建一个变量来控制input的显示
    const [input, setInput] = useState(false);


    // 点击评论触发的函数
    function handleAppraise() {
        setAppraise([])
        context1.name()
        setInput(true)
    }

    // 评论的触发的函数
    async function emitClick(v) {
        setLoading(true)
        // 发送评论
        let res = await Axios("/test/home/moment_comment", { father: props.data.Id, comment: v, issuer: localStorage.getItem("user") });
        setLoading(false);
        setInput(false);
        if(res.status === 1){
            message.success(res.info);
            let obj = {
                data:res.data,
                item:props.item
            }
            // 向父组件传递函数通知父组件更新瞬间
            props.UpdateComment(obj);
        }else{
            message.error(res.info);
        }
    }

    // 点击查看评论的函数
    async function ShowAppraise() {
        setLoading(true);
        let res = await  Axios("/test/home/get_appraise?id=" + props.data.Id)
        setLoading(false);
        if (res.status === 1) {
            setAppraise(res.data);
        }else{
            message.error(res.info);
        }
    }

    return (<Spin tip="Loading..." spinning={loading}><div className={IndexCss.template}>
        <div className={IndexCss.header}>
            <img className={IndexCss.headerImg} src={data.uid.icon} alt="头像" />
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
            <div className={IndexCss.appraise}> <div onClick={handleAppraise}><i className="iconfont icon-pinglun" /><span>{data.browse}条</span></div><p onClick={ShowAppraise}>查看评论</p></div>
            {/* 接受到评论的input的值 */}
            <CommentInputAndBut emitClick={emitClick} input={input} />
            {appraise.map((v,i)=>{
                return <CommentUI data={v} key={i} />
            })}
        </div>
    </div></Spin>)
}


// 评论页面组件
function CommentUI(props) {

    let data = props.data;
    // 共享了一个context数据 .name为一个判断用户是否有登录的函数
    const context1 = useContext(context);
    // 创建一个判断用户是否需要评论的变量
    const [visible, setVisible] = useState(false);

    // 当用户点击发布瞬间时判断是否登录 没有则跳到登录页面
    function handleDrawer() {
        context1.name()
        setVisible(true);
    }

    return (<div className={IndexCss.commBox}><div className={IndexCss.comment}>
        <div className={IndexCss.image}>
            <img alt="头像" src={data.issuer.icon} />
        </div>
        <div className={IndexCss.userText}>
        <header>{data.issuer.username || data.issuer.mobile}</header>
            <span>{data.comment} <button onClick={handleDrawer}>回复</button></span>
        </div>
    </div>
        <CommentInputAndBut input={visible} />
        {/* <div className={IndexCss.more}>此处还有100条回复<i className="iconfont icon-zhuanxiang" /></div> */}
    </div>)
}

export default Lobby;