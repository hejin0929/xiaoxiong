// 项目首页
import React from 'react';
import Axios from '../../utils/axios';

export default function Home() {

    function click() {
        Axios("/test/index");
    }
    return (<div>
        <button onClick={click}>导航守卫点我进行守卫</button>
    </div>)
}