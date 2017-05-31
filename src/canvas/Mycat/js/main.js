/**
 * Created by ASUS FDD on 2016/4/10.
 */
/************第一步************/
var stage=new createjs.Stage("gameView");
createjs.Ticker.setFPS(30);/*设置帧数*/
createjs.Ticker.addEventListener("tick",stage);

var gameView=new createjs.Container();/*创建一个承载的容器*/
stage.addChild(gameView);/*添加到舞台当中*/

gameView.x=30;
gameView.y=30;

/***************逻辑问题：创建三种不同的圆-分别是初始颜色，点击后颜色，和cat在的位置颜色***************/
function Circle(){
    createjs.Shape.call(this);
    this.setCircleType = function(type){
        this._circleType = type;
        switch (type){
            case Circle.TYPE_UNSELECTED:
                this.setColor("#cccccc");
                break;
            case Circle.TYPE_SELECTED:
                this.setColor("#ff6600");
                break;
            case Circle.TYPE_CAT:
                this.setColor("#0000ff");
                break;
        }
    }

    this.setColor = function (colorString){
        this.graphics.beginFill(colorString);
        this.graphics.drawCircle(0,0,25);
        this.graphics.endFill();
    }
    this.getCircleType = function(){
        return this._circleType;
    }
    this.setCircleType(1);
}
Circle.prototype = new createjs.Shape();
Circle.TYPE_UNSELECTED = 1;
Circle.TYPE_SELECTED = 2;
Circle.TYPE_CAT = 3;


/*************开始绘制9*9画布**************/
var circleArr=[[],[],[],[],[],[],[],[],[]];
var currentCat;//创建一个值来储存当前的猫的位置
var MOVE_NONE=-1,MOVE_LEFT = 0,MOVE_UP_LEFT=1,MOVE_UP_RIGHT= 2,MOVE_RIGHT= 3,MOVE_DOWN_RIGHT= 4,MOVE_DOWN_LEFT=5;

function getMoveDir(cat){

    var distanceMap=[];
    //left
    var can = true;
    for(var x = cat.indexX;x>=0;x--){
        if(circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_LEFT] = cat.indexX-x;
            break;
        }
    }
    if(can){
        return MOVE_LEFT;
    }
    //left up
    can = true;
    var x = cat.indexX,y = cat.indexY;
    while(true){
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_UP_LEFT] = cat.indexY-y;
            break;
        }
        if(y%2 == 0){
            x--;
        }
        y--
        if(y<0||x<0){
            break;
        }
    }
    if(can){
        return MOVE_UP_LEFT;
    }
    //right up
    can = true;
    x = cat.indexX,y = cat.indexY
    while(true){
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_UP_RIGHT] = cat.indexY - y;
            break;
        }

        if(y%2 ==1){
            x++
        }
        y--;
        if(y<0 || x>8){
            break
        }
    }

    if(can){
        return MOVE_UP_RIGHT;
    }

    //right
    can = true;
    for(var x = cat.indexX;x<9;x++){
        if(circleArr[x][cat.indexY].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_RIGHT] = x - cat.indexX;
            break;
        }
    }
    if(can){
        return MOVE_RIGHT;
    }
    //right down
    can = true;
    x = cat.indexX,y = cat.indexY;
    while(true){
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_DOWN_RIGHT] = y-cat.indexY;
            break;
        }
        if(y%2 == 1){
            x++;
        }
        y++;
        if(y>8 ||x>8){
            break;
        }
    }
    if(can){
        return MOVE_DOWN_RIGHT;
    }
    //left down
    can = true;
    x = cat.indexX,y=cat.indexY;
    while(true){
        if(circleArr[x][y].getCircleType() == Circle.TYPE_SELECTED){
            can = false;
            distanceMap[MOVE_DOWN_LEFT] = y-cat.indexY;
            break;
        }
        if(y%2==0){
            x--;
        }
        y++;
        if(y>8||x<0){
            break;
        }
    }
    if(can){
        return MOVE_DOWN_LEFT;
    }
    var maxDir = -1,maxValue= -1;
    for(var dir = 0;dir <distanceMap.length;dir++){
        if(distanceMap[dir]>maxValue){
            maxValue = distanceMap[dir];
            maxDir = dir;
        }
    }
    if(maxValue>1){
        return maxDir;
    }else{
        return MOVE_NONE;
    }
}

function circleClicked(event){
    if(event.target.getCircleType() != Circle.TYPE_CAT ){
        event.target.setCircleType(Circle.TYPE_SELECTED);
    }else
    {
        return;
    }
    if(currentCat.indexX == 0 || currentCat.indexX==8 ||currentCat.indexY == 0 || currentCat.indexY==8){
        alert("游戏结束");
        return;
    }

    var dir = getMoveDir(currentCat);
    switch (dir){
        case MOVE_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexX-1][currentCat.indexY];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        case MOVE_UP_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2?currentCat.indexX:currentCat.indexX-1][currentCat.indexY-1];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        case MOVE_UP_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2?currentCat.indexX+1:currentCat.indexX][currentCat.indexY-1];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        case MOVE_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexX+1][currentCat.indexY];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        case MOVE_DOWN_RIGHT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2?currentCat.indexX+1:currentCat.indexX][currentCat.indexY+1];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        case MOVE_DOWN_LEFT:
            currentCat.setCircleType(Circle.TYPE_UNSELECTED);
            currentCat = circleArr[currentCat.indexY%2?currentCat.indexX:currentCat.indexX-1][currentCat.indexY+1];
            currentCat.setCircleType(Circle.TYPE_CAT);
            break;
        default :
            alert("游戏结束");

    }



}

function addCircles() {
    for(var indexY=0;indexY<9;indexY++){
        for (var indexX=0;indexX<9;indexX++){
            var c=new Circle();
            gameView.addChild(c);
            circleArr[indexX][indexY]=c;
            c.indexX=indexX;
            c.indexY=indexY;
            //设置每个圆的中心
            c.x=indexY%2?indexX*55+25:indexX*55;//单数行向后移动25
            c.y=indexY*55;
            if(indexY==4&&indexX==4){
                c.setCircleType(3);
                currentCat=c;
            }else if(Math.random()<0.1){
                c.setCircleType(Circle.TYPE_SELECTED);
            }
            //添加点击事件
            c.addEventListener("click",circleClicked);
        }
    }
    // console.log("执行过2");
}
addCircles();