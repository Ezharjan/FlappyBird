//导演类控制游戏的整个逻辑
import {DataStore} from "./base/DataStore.js";
import {UpPencil} from "./runtime/UpPencil.js";
import {DownPencil} from "./runtime/DownPencil.js";

export class Director {

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {

        this.dataStore = DataStore.getInstance();
        this.moveSpeed = 2;
    }

    createPencil() {
        const minTop = DataStore.getInstance().canvas.height / 8;
        const maxTop = DataStore.getInstance().canvas.height / 2;
        const top = minTop + Math.random() * (maxTop - minTop);
        this.dataStore.get('pencils').push(new UpPencil(top))
        this.dataStore.get('pencils').push(new DownPencil(top))
    }

    birdsEvent() {
        for (let i = 0; i <= 2; i++) {
            //根据玩家点击事件来让小鸟能够向上位移
            this.dataStore.get('birds').y[i] =
                this.dataStore.get('birds').birdsY[i];
        }
        //每次点击之后必须要将时间置零，否则速度会越来越快！
        this.dataStore.get('birds').time = 0;//置零！！
    }

    static isStrikeWithPen(bird, pencil) {
        let striked = false;
        if (bird.top > pencil.bottom
            || bird.bottom < pencil.top
            || bird.right < pencil.left
            || bird.left > pencil.right) {
            striked = true;
        }
        return !striked;

    }

    checkDrop() {
        const birds = this.dataStore.get('birds');
        const pencils = this.dataStore.get('pencils');
        const land = this.dataStore.get('land');
        const score = this.dataStore.get('score');

        //地板撞击判断
        if (birds.birdsY[0] + birds.birdsHeight[0] >= land.y) {
            console.log("碰到地板了！");
            this.isGameOver = true;
            return;
        }

        //创建小鸟的碰撞体
        const birdsBorder = {
            top: birds.y[0],
            bottom: birds.birdsY[0] + birds.birdsHeight[0],
            left: birds.birdsX[0],
            right: birds.birdsX[0] + birds.birdsWidth[0]
        };

        //创建铅笔的碰撞体
        const penLength = pencils.length;
        for (let i = 0; i < penLength; i++) {
            const pencil = pencils[i];
            const pencilBorder = {
                top: pencil.y,
                bottom: pencil.y + pencil.height,
                left: pencil.x,
                right: pencil.x + pencil.width
            };
            if (Director.isStrikeWithPen(birdsBorder, pencilBorder)) {
                console.log("撞到铅笔啦！");
                this.isGameOver = true;
                return;
            }
        }

        //加分逻辑
        if (birds.birdsX[0] > pencils[0].x + pencils[0].width
            && score.isScorable) {
            var params = {
                success:function(){
                    console.log('震动成功');
                }
            };
            wx.vibrateShort(params);
            score.isScorable = false;
            score.scoreNumber++;
        }
    }

    run() {

        this.checkDrop();

        if (!this.isGameOver) {
            this.dataStore.get('background').draw();

            //重要逻辑点！！！pencils数组永远只有4个！！！
            const pencils = this.dataStore.get('pencils');
            //铅笔的右侧刚好越过了左侧的边界——销毁
            if (pencils[0].x + pencils[0].width <= 0
                && pencils.length === 4) {
                pencils.shift();//将第一个元素推出数组并将数组个数减一
                pencils.shift();

                //以便于后续分数的累计
                this.dataStore.get('score').isScorable = true;
            }
            //创建铅笔
            if (pencils[0].x <= (DataStore.getInstance().canvas.width - pencils[0].width) / 2
                && pencils.length === 2) {
                this.createPencil();
            }

            this.dataStore.get('pencils').forEach(function (value, index, array) {
                value.draw();
            });

            this.dataStore.get('land').draw();
            this.dataStore.get('score').draw();
            this.dataStore.get('birds').draw();

            let timer = requestAnimationFrame(() => this.run());
            this.dataStore.put('timer', timer);//将可以终止动画的开关存在DataStore中
        } else {
            console.log("Game is over!");
            this.dataStore.get('startButton').draw();//游戏结束的时候呈现开始按钮
            cancelAnimationFrame(this.dataStore.get('timer'));//停止动画
            this.dataStore.destroy();
        }
    }
}