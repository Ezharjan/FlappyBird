import {Sprite} from "../base/Sprite.js";

//循环渲染图片的中的三只小鸟
export class Birds extends Sprite {
    constructor() {
        const image = Sprite.getImage('birds');
        super(image, 0, 0,
            image.width, image.height,
            0, 0, image.width, image.height);

        //小鸟的三种状态需要一个数组去存储
        //小鸟的宽是34，上下边距是10，左右边距是9
        this.clippingX = [
            9,
            9 + 34 + 18,
            9 + 34 + 18 + 34 + 18
        ];
        this.clippingY = [10, 10, 10];
        this.clippingWidth = [34, 34, 34];
        this.clippingHeight = [24, 24, 24];

        //小鸟的初始位置；私有的声明为const
        const birdX = window.innerWidth / 4;
        this.birdsX = [birdX, birdX, birdX];
        const birdY = window.innerHeight / 2;
        this.birdsY = [birdY, birdY, birdY];

        const birdWidth = 34;
        this.birdsWidth = [birdWidth, birdWidth, birdWidth];
        const birdHeight = 24;
        this.birdsHeight = [birdHeight, birdHeight, birdHeight];

        //根据玩家交互而变化的是小鸟的Y坐标，将其存入数组
        this.y = [birdY, birdY, birdY];
        this.index = 0;//第几只小鸟
        this.count = 0;//次数
        this.time = 0;//小鸟自由落体下落时间
    }

    draw() {
        //不能是小数！否则无法在数组中取出对应的index值。
        //但是鉴于浏览器刷新速度大，因此必须要通过减小速度来改变小鸟
        //在绘制过程中的闪烁问题！使用向下取整对index进行处理！
        const changeBirdSpeed = 0.2;
        this.count = this.count + changeBirdSpeed;
        if (this.index >= 2) {
            this.count = 0
        }

        //直接取，因为速度是小数所以就无法顺序读取
        // this.index = this.count;
        //使用向下取整的方式，减缓素的并取出对应小鸟
        this.index = Math.floor(this.count);//减速器的作用

        //添加小鸟的重力——不能直接使用物理学上的重力！！
        const g = 0.98 / 2.4;//伪重力

        //为了营造飞的真实感，在掉落时需要向上偏移一点
        const offsetUp = 30;

        //小鸟的位移（直接使用重力公式）
        const offsetY = (g * this.time * (this.time - offsetUp)) / 2;
        for (let i = 0; i <= 2; i++) {
            //注意birdsY和birdY的区别，不要混淆！！！
            this.birdsY[i] = this.y[i] + offsetY;
        }
        this.time++;

        super.draw(
            this.img,
            this.clippingX[this.index], this.clippingY[this.index],
            this.clippingWidth[this.index], this.clippingHeight[this.index],
            this.birdsX[this.index], this.birdsY[this.index],
            this.birdsWidth[this.index], this.birdsHeight[this.index]
        );
    }
}