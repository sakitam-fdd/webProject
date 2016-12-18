/**
 * Created by ASUS on 2016/4/10.
 */
/***************逻辑问题：创建三种不同的圆-分别是初始颜色，点击后颜色，和cat在的位置颜色***************/
function Circle() {
    createjs.Shape.call(this);
    /*********设置一个函数来控制圆的类型*********/
    this.setCircleType=function (type) {
        this._circleType=type;
        switch (type){
            case 1:
                this.setColor("#cccccc");
                break;
            case 2:
                this.setColor("#ff6600");
                break;
            case 3:
                this.setColor("blue");
                break;
        }
    };

    /********创建一个函数用来定义圆的颜色********/
    this.setColor = function (colorString) {
        this.graphics.beginFill("colorString");
        this.graphics.drawCircle(0,0,25);
        this.graphics.endFill();
    };
    /*************回调函数***********/
    this.getCircleType=function () {
        return this._circleType;
    };
    this.setCircleType(1);/*调用方法后默认是灰色*/
    console.log("执行过");
}
Circle.prototype=new createjs.Shape();