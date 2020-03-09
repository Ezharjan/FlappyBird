//初始化整个游戏的精灵，作为游戏开始的入口
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";
import {Background} from "./js/runtime/Background.js";
import {DataStore} from "./js/base/DataStore.js";
import {Land} from "./js/runtime/Land.js";
import {Birds} from "./js/player/Birds.js";
import {StartButton} from "./js/player/StartButton.js";
import {Scores} from "./js/player/Scores.js";

export class Main {
    constructor() {
        console.log("Running...");
        // new ResourceLoader();
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');

        //初始化DataStore
        this.dataStore = DataStore.getInstance();

        this.director = Director.getInstance();

        //通过这样的简单工厂的方法就能够控制它的实例化和传参的过程
        const loader = ResourceLoader.create();
        //当所有的资源已经加载完成了才去回调onResourceFirstLoaded函数！！！
        loader.onLoaded(map => this.onResourceFirstLoaded(map));


    }

    //创建背景音乐
    createBackgroundMusic() {
        var bgm = wx.createInnerAudioContext();
        bgm.autoplay = true;
        bgm.loop = true;
        bgm.src = 'audios/bgm.mp3';
    }


    //资源只需要加载一次，重新开始游戏的时候只用重置逻辑即可
    onResourceFirstLoaded(map) {

        //将长期保存而不必销毁的元素放在类的变量中（而需要销毁的则放在类的map中）；
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;

        this.createBackgroundMusic();

        this.init();
    }

    init() {

        //首先，重置游戏状态为尚未结束
        this.director.isGameOver = false;

        this.dataStore
            .put('pencils', [])
            .put('background', Background)
            .put('land', Land)
            .put('birds', Birds)
            .put('startButton', StartButton)
            .put('score', Scores)
        ;//可以进行链式操作，一层一层往下put。

        this.registerEvent();

        //要在游戏运行之前就创建好铅笔！！！
        this.director.createPencil();
        this.director.run();
    }

    registerEvent() {

        wx.onTouchStart(() => {
            if (this.director.isGameOver) {
                console.log("游戏开始！");
                this.init();
            } else {
                this.director.birdsEvent();//绑定点击事件，导演控制
            }
        })
    }
}