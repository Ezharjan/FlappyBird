//导演类控制游戏的整个逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {

    //单例——只允许又一个导演
    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        //即便多次调用getInstance也只会执行一次。
        //这就是ES6实现单例模式。
        console.log('构造器初始化');

        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
    }

    createPencil() {
        const minTop = window.innerHeight / 8;
        const maxTop = window.innerHeight / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top))
        this.dataStore.get('pencils').push(new DownPencil(top))
    }

    run() {
        this.dataStore.get('background').draw();
        this.dataStore.get('pencils').forEach(function (value, index, array) {

            value.draw();
        });

        this.dataStore.get('land').draw();

        let timer = requestAnimationFrame(() => this.run());
        this.dataStore.put('timer', timer);//将可以终止动画的开关存在DataStore中
        // cancelAnimationFrame(this.dataStore.get('timer'));//停止动画
    }

}