// 评论功能的输入按钮以及input输入框
import React, { useRef } from 'react';
import IndexCss from './index.module.scss';

function CommentInputAndBut(params) {
    // 创建一个ref的钩子将点击评价按钮获取到input的值
    const inp = useRef("");

        // 点击评价触发的函数
        function handleClick() {
            // 获取到input的内容将其发送到父组件上
            params.emitClick(inp.current.value);
        }
    return (<div>
        {params.input && <div className={IndexCss.issue}><input ref={inp} /><button onClick={handleClick}>评论</button></div>}
    </div>)
}


export default CommentInputAndBut;