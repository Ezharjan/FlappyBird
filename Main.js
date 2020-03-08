//初始化整个游戏的精灵，作为游戏开始的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {Background} from "./js/runtime/Background.js";
import {DataStore} from "./js/base/DataStore.js";
import {Land} from "./js/runtime/Land.js";

export class Main {
    constructor() {
        console.log("Running...");
        // new ResourceLoader();
        this.canvas = document.getElementById('game_canvas');
        this.ctx = this.canvas.getContext('2d');

        //初始化DataStore
        this.dataStore = DataStore.getInstance();

        this.director = Director.getInstance();

        //通过这样的简单工厂的方法就能够控制它的实例化和传参的过程
        const loader = ResourceLoader.create();
        //当所有的资源已经加载完成了才去回调onResourceFirstLoaded函数！！！
        loader.onLoaded(map => this.onResourceFirstLoaded(map));

        //多次调用单例但是只会调用一次
        // Director.getInstance();
        // Director.getInstance();
        // Director.getInstance();

        /*
        //drawImage剪裁图片
        let image = new Image();
        image.src = '../res/background.png';

        //只有加载完图片才能进行渲染！！！
        image.onload = () => {//使用箭头函数获取外部的this
            this.ctx.drawImage(
                image,//剪裁对象
                0,  //剪裁的X轴起始位置
                0,  //剪裁的Y轴起始位置
                image.width,
                image.height,
                0,  //canvas在X轴上的0位置
                0,   //canvas在Y轴上的0位置
                image.width,
                image.height,
            );
        }

*/
    }

    //资源只需要加载一次，重新开始游戏的时候只用重置逻辑即可
    onResourceFirstLoaded(map) {

        //将长期保存而不必销毁的元素放在类的变量中（而需要销毁的则放在类的map中）；
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;

        this.init();
        // console.log(map);
    }

    init() {
        this.dataStore
            .put('pencils', [])
            .put('background', Background)
            .put('land', Land)
        ;//可以进行链式操作，一层一层往下put。
        //要在游戏运行之前就创建好铅笔！！！
        this.director.createPencil();
        this.director.run();
    }
}