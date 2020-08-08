// 展览大厅页面
import React, { useState } from 'react';

import IndexCss from './index.module.scss';

import { Drawer } from 'antd';

import AddArticle from './addArticle';

function Lobby() {
    const [visible, setVisible] = useState(false);

    function onClose() {
        setVisible(false)
    }

    function handleDrawer(params) {
        setVisible(true)
    }

    return (<div className={IndexCss.lobby}>
        <div className={IndexCss.title}>
            <div className={IndexCss.write} onClick={handleDrawer}>
                <i className="iconfont icon-pen" />写攻咯?
            </div>
            <div className={IndexCss.filtrate}>
                <ul>
                    <li>最新文章</li>
                    <li>热门文章</li>
                    <li>推荐文章</li>
                </ul>
            </div>
        </div>

        <div className={IndexCss.articleBox}>
            123
        </div>

        <Drawer
            title="写文章"
            placement="right"
            onClose={onClose}
            visible={visible}
            width="80%"
        >
            <AddArticle CloseDrawer={onClose}/>
        </Drawer>
    </div>)
}

export default Lobby;