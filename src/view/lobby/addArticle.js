// 添加文章的页面
import React, { useRef, useState } from 'react';

import IndexCss from './index.module.scss';

import { message } from 'antd';
// 引入btu按钮
import { FromBut } from '../../component/button';
// 引入Axios请求
import Axios from '../../utils/axios';

function AddArticle(props) {

    const fromData = useRef("");
    // 创建一个照片数组
    const [imgList, setImgList] = useState([]);

    // 上传图片触发函数
    function UploadImage() {
        // 创建一个读取form数据的函数
        let formDatas = new FormData(fromData.current);
        // 创建一个读取文件的函数
        let file = new FileReader();

        file.readAsDataURL(formDatas.get("image"));

        let img = formDatas.get("image");

        if (img.name.indexOf(".jpg") !== -1) {
            file.onload = function (e) {
                var e1 = window.event || e;
                var imgFile = e1.target.result;
                var img1 = new Image();
                img1.src = imgFile;
                img1.onload = function () {
                    let img = imgList;

                    // 讲图片发送到后端进行储存
                    Axios("/test/home/upload_image", { data: img1.src }).then((res) => {
                        if (res.status) {
                            img.unshift(res.info);
                            setImgList(img);
                        } else {
                            message.warning(res.info)
                        }
                    })
                }
            };
        } else {
            message.warning("只支持上传jpg类型的图片");
        }
    }

    // 创建一个删除函数
    function removeImage(i) {
        let num = i || 1;
        Axios("/test/home/remove_image?id=" + imgList[i]).then(res => {
            if (res.status) {
                imgList.splice(i, num);
                setImgList(imgList);
                message.success(res.info);
            } else {
                message.error(res.info);
            }
        })
    }

    // 点击取消触犯的函数
    function resetClick() {
        let data = imgList;

        var list = data.map((v, i) => {
            return new Promise((resolve, reject) => {
                console.log("/test/home/remove_image?id=" + v);
                Axios("/test/home/remove_image?id=" + v).then(res => {
                    if (!res.status) {
                        reject(i)
                    }
                    imgList.splice(i, i || 1);
                    setImgList(imgList);
                    resolve(v)
                })
            })
        })

        Promise.all(list).catch((err) => {
            Axios("/test/home/remove_image?id=" + imgList[err]).then(() => {
                imgList.splice(err, err || 1);
                setImgList(imgList);
            })
        }).then(() => {
            if (imgList)
                props.CloseDrawer()
        })
    }

    // 表单提交
    async function onFocus(e) {
        e.preventDefault();
        // 提取出表单数据
        let data = new FormData(e.target);
        let obj = {};
        obj.title = data.get("title");
        obj.content = data.get("content");
        obj.image = imgList;
        obj.uid = localStorage.getItem("user");

        let res = await Axios("/test/home/add_article", obj);
        if (res.status) {
            message.success(res.info);
            props.CloseDrawer();
        } else {
            message.error(res.info);
        }
    }

    return (<div className={IndexCss.AddArticle}>
        <form ref={fromData} onSubmit={onFocus} >
            <ul>
                <li>
                    <label>标题</label><input name="title" />
                </li>
                <li>
                    <div className={IndexCss.imgBox}>
                        <label>上传图片</label><input name="image" onChange={UploadImage} type="file" />
                        <div className={IndexCss.imgCss}>
                            <i className="iconfont icon-tianjiaxiangce" />
                        </div>
                    </div>
                    <div className={IndexCss.imgListCss}>
                        {imgList.map((v, i) => {
                            return <div key={i} className={IndexCss.imgItem}>
                                <div className={IndexCss.imgIcon}>
                                    <a href={v} target="_top" className="iconfont icon-chakan">{""}</a>
                                    <i onClick={() => removeImage(i)} className="iconfont icon-lajitong" />
                                </div>
                                <img src={v} alt="图片" />
                            </div>
                        })}
                    </div>
                </li>
                <li>
                    <label>内容:</label><textarea name="content" rows={10} />
                </li>
                <div style={{ width: "40%" }}>
                    <FromBut resetClick={resetClick} submit="发布" />
                </div>
            </ul>
        </form>
    </div>)
}


export default AddArticle;