
window.addEventListener('load', eventWindowLoaded, false);
function eventWindowLoaded(){

window.addEventListener('resize', function(){
    //console.log(ball.pos);
    init();
    if(ball) ball.y = ball.pos + (canvas.height - gameWorld.height);
    //console.log(ball.y)
    for(var i = 0; i < objects.length; i++){ 
        if(objects[i].row || objects[i].col){
            objects[i].x = objects[i].col*gameObjectSize
            objects[i].y = canvas.height - gameObjectSize*(mapRows-objects[i].row)
        }   
    }
   if(gameState != STATE_READY) render(); //so the objects are re-drawn 
});

let playBtn = document.getElementById("play");
let pauseBtn = document.getElementById("pause");
let startBtn = document.getElementById("start");
let resetBtn = document.getElementById("reset");
let restartBtn = document.getElementById("restart");
let menuBtn = document.getElementById("menu");
let settingsBtn = document.getElementById("settings");
let creditsBtn = document.getElementById("credits");
let storeBtn = document.getElementById("store");


let pauseDialog = document.getElementById("pauseD");
let menuDialog = document.getElementById("menuD");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const STATE_INIT = 10;
const STATE_LOADING = 20;
const STATE_READY = 30
const STATE_PLAYING = 40;
const STATE_PAUSED = 50
const STATE_RESTART = 60;
const STATE_OVER = 70;
const STATE_COMPLETE = 80;
 
let gameState = STATE_INIT;

let logedState = false;
//<--------------------------------------------------------------------------------------------------->
function run() {
    
    switch(gameState) {
        case STATE_INIT:
            if(!logedState) console.log("initializing");
            logedState = true;
            init(true);
            loadTileshite();
            break;
        case STATE_LOADING:
            if(!logedState) console.log("loading");
            logedState = true;
            createObjects(levels[currentLevel]);
            break;
        case STATE_READY:
            if(!logedState) console.log("getting ready");
            logedState = true;
            startGame();
            break;
        case STATE_PLAYING:
            if(!logedState) console.log("playing");
            logedState = true;
            render();
            break;
        case STATE_PAUSED:
            if(!logedState) console.log("paused");
            logedState = true;
            break;
        case STATE_RESTART:
            
            break;
        case STATE_OVER:
            if(!logedState) console.log("game over");
            logedState = true;
            ctx.drawImage(tileSheet, 256, 192, ball.sourceDx, ball.sourceDy,
                       canvas.width/2 - 100, canvas.height/2 - 100, 200, 200);
            break;
        case STATE_COMPLETE:
            if(!logedState) console.log("Level Complete");
            logedState = true;
            break;
    }
 }
 
//<-------------------------------------------------------------------------------------------------------->
function init(onStart){
    //initialization
    if(onStart == undefined) onStart = false;
    if(onStart){
        window.removeEventListener('load', eventWindowLoaded, false);
        console.log("initialization complete")
        logedState = false;
        gameState = STATE_LOADING;
    }
	
	canvas.width = innerWidth;
	canvas.height = innerHeight;
    playBtn.style.left = canvas.width  - 50 + "px";
    pauseBtn.style.left = canvas.width  - 50 + "px";
    resetBtn.style.left = canvas.width  - 50 + "px";
    //startBtn.style.top = canvas.height/2 - 30 + "px";
    //startBtn.style.left = canvas.width/2 - 60 + "px";
    pauseDialog.style.left = canvas.width/2 - 100 + "px";
    pauseDialog.style.top = canvas.height/2 - 100 + "px";
    menuDialog.style.left = canvas.width/2 - 100 + "px";
    menuDialog.style.top = canvas.height/2 - 100 + "px";
}

//<------------------------------------------------------------------------------------------------------->
//One handler for all click event(Note there will be no need to remove it)
window.addEventListener('click',clickHandler,false);
function clickHandler(e){
    // console.log(e.target)
    if(e.target == startBtn){
        gameStarted();
    }
    else if(e.target == pauseBtn){
        pauseGame();
    }
    else if(e.target == playBtn){
        playGame();
    }
    else if(e.target == menuBtn){
        restartGame();
        gameState = STATE_READY;
    }
    else if(ball.missed && gameState != STATE_OVER || e.target == resetBtn){
        resetGame();
    }
    else if(e.target == restartBtn){
        restartGame();
        playGame();
    }
    else if(gameState == STATE_PLAYING){
        ball.state = "jump";
        // console.log(e.clientX + camera.x)
    }
}

//<--------------------------------------------------------------------------------------------------->
//When game is ready to start, go ahead and start it onclick of start button
function startGame(){
    menuDialog.style.display = "block";
}
// start , pause, play functions 
function gameStarted(){
    menuDialog.style.display = "none";
    pauseBtn.style.display = "block";
    console.log("ready");
    logedState = false;
    gameState = STATE_PLAYING;
    playSound(`level${currentLevel}`, 0.25);
}
function pauseGame(){
    if(ball.missed){
        pauseBtn.style.display = "none";
        resetBtn.style.display = "block";
        console.log("missed");
    }else{
        pauseBtn.style.display = "none";
        playBtn.style.display = "block";
        pauseDialog.style.display = "block";
        logedState = false;
        gameState = STATE_PAUSED;
    }
    
}
function playGame(){
    playBtn.style.display = "none";
    resetBtn.style.display = "none";
    pauseBtn.style.display = "block";
    pauseDialog.style.display = "none";
    logedState = false;
    gameState = STATE_PLAYING;
}
function restartGame(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the screen
    pauseDialog.style.display = "none";
    playBtn.style.display = "none";
    objects.length = 0;
    walls.length = 0;
    obstacles.length = 0;
    fireArr.length = 0;
    hearts.length = 0;
    coins.length = 0;
    createObjects(levels[currentLevel]);
    trial = LIVE;
    collectedCredit = 0;

}
function resetGame(){
    if(gameState == STATE_OVER){
        restartGame();
    }
    else{
        ball.resume();
    }
    playGame();
}
function gameOver(){
    pauseBtn.style.display = "none"
    resetBtn.style.display = "block";
    logedState = false;
    gameState = STATE_OVER;
}

//<-------------------------------------------------------------------------------------------------->
// Loading the tilesheet 
let tileSheet;
function loadTileshite(){
    tileSheet = new Image();
    tileSheet.addEventListener('load', eventSheetLoaded , false);
    tileSheet.src = "assets/images/ball_sheet.png";
}

function eventSheetLoaded(){ 
    tileSheet.removeEventListener('load', eventSheetLoaded , false);
}

// tilesheet infomation
let tileInRow = 5;
let originalTileWidth = 64;
let originalTileHeight = 64;
let gameObjectSize= 30;

// Map information
let mapRows = levels[currentLevel].length;
let mapCols = levels[currentLevel][0].length;


//<-------------------------------------------------------------------------------------------------->
// Global game variables
let gravity = 0.0013;
const LIVE = 3;
let trial = LIVE; //initialized at the init function
let totalCredit;
let collectedCredit = 0;

//-----All Game objects----

// Object array hold all object. 
let objects = [];
// walls array hold all wall
let walls = [];
// obstacle array to hold all obstacle
let obstacles = [];
// heart array to hold the lives
let hearts = [];
// Fire array to hold the fire sprite
let fireArr = [];
// coins array to hold all coins
let coins = [];

// Wall class
class Wall{
    constructor(sourceX,sourceY,col,row){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.col = col;
        this.row = row;
        this.x = col*gameObjectSize;
        this.y = canvas.height - gameObjectSize*(mapRows-row);
        
        // constant variables
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize;
        this.height = gameObjectSize;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
}
//Obstacle class
class Obstacle{
    constructor(sourceX,sourceY,col,row){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.col = col;
        this.row = row;
        this.x = col*gameObjectSize;
        this.y = canvas.height - gameObjectSize*(mapRows-row);

        // constant variables
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize;
        this.height = gameObjectSize;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
}
//Ball class
class Ball{
    constructor(sourceX,sourceY,x,y){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.x = x
        this.y = y;
        this.vx = 0; 
        this.vy = 0;
        this.pos = this.y - (canvas.height - gameWorld.height);
        this.acceleration;
        this.state;
        this.missed = false;
        this.live = trial;
        // constant variables
        this.maxVx = 6.5;
        this.elasticity = 0.6;
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = 20 //gameObjectSize;
        this.height = 20 //gameObjectSize;
        
    }
    moveForward(){
        this.acceleration = 0.06;
        if(this.missed){
            this.vx = 0;
        }else{
            if(this.vx > this.maxVx){
                this.vx = this.maxVx;
            }else{
                this.vx += this.acceleration;
            }
        }
    }
    jump(){
        this.vy = -10;
        this.state = "rest";
        playSound("jump", 0.4);
    }
    miss(){
        this.acceleration = 0;
        this.vy = 0;
        if(!this.missed){
            this.missed = true
            playSound("missed", 0.8);
            this.live--;
            if(this.live > 0){
                pauseGame();
            }
            else{
                gameOver();
            }
        }
        
    }
    resume(){
        this.missed = false;
        this.x -= 170;
        this.y -= 20;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
    update(){
        this.pos = this.y - (canvas.height - gameWorld.height);
        
        if(this.live > 0){

            //Collission between ball and home(end of game)
            if(rectCollide(ball,home) != 'none'){
                playSound("finished", 1)
                gameState = STATE_COMPLETE;
            }
            // Collision between ball and Coins
            for(var i = 0; i < coins.length; i++){
                if(rectCollide(ball,coins[i]) != 'none'){
                    if(!coins[i].collected){collectedCredit++; playSound("coin pick up", 0.7);}
                        coins[i].collected = true;
                }
            }
            // Collision between ball and Obstacle
            for(var i = 0; i < obstacles.length; i++){
                if(rectCollide(ball,obstacles[i],true) != 'none'){
                    this.miss();
                }
            }

             // Collision between ball and Fire
             for(var i = 0; i < fireArr.length; i++){
                if(rectCollide(ball,fireArr[i],true) != 'none'){
                    this.miss();
                }
            }
            this.moveForward();

            // if(this.y + this.height > canvas.height){
            //     this.miss();
            // }else{
                //collision between ball and wall
                for(var i = 0; i < walls.length; i++){
                    let collissionSide = rectCollide(this,walls[i],true);
                    if(collissionSide == "top"){
                        this.vy *= -0.3;
                    }
                    if(collissionSide == "right"){
                        this.vx *= -0.1;
                    }
                    if(collissionSide == 'bottom'){ //bottom of ball since ball is the first argument
                        this.y = walls[i].y - this.height; //return to base
                        this.vy = -this.vy * this.elasticity; //bounce off
                        if(this.vy < 0 && this.vy > -4) this.vy = 0; // to stop tiny endless bounce
                        if(this.vy < 0)playSound("bounce", 0.5);
                        if(this.state == "jump"){
                            this.jump();
                            }
                    }else{
                        this.vy += gravity;
                    }
                }
            //}
            this.x += this.vx;
            this.y += this.vy;
        }else{
            //console.log("game over");
            // ctx.drawImage(tileSheet, 256, 192, this.sourceDx, this.sourceDy,
            //             canvas.width/2 - 100, canvas.height/2 - 100, 200, 200);
            gameState = STATE_OVER;
        }
    }
}
//camera class
class Camera{
    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height= height;
    }
    update(){
        this.width = canvas.width;

        this.topInnerBoundary = this.y + (this.height * 0.4); 
        this.bottomInnerBoundary = this.y + (this.height * 0.6); 
        this.leftInnerBoundary = this.x + (this.width * 0.25); 
        this.rightInnerBoundary = this.x + (this.width * 0.35); 

        if(ball.y < this.topInnerBoundary){ 
            this.y -= Math.floor(Math.abs(ball.y  - this.topInnerBoundary));
        }
        if(ball.y + ball.height > this.bottomInnerBoundary){ 
            this.y += Math.floor(ball.y + ball.height - this.bottomInnerBoundary);
        }
        if(ball.x  < this.leftInnerBoundary){ 
            this.x -= Math.floor(Math.abs(ball.x + this.leftInnerBoundary)); 
        }
        if(ball.x + ball.width > this.rightInnerBoundary){ 
            this.x += Math.floor(ball.x + ball.width - this.rightInnerBoundary);
        }
        

        if(this.x < gameWorld.x){ 
            this.x = gameWorld.x;
        }
        if(this.x + this.width > gameWorld.x + gameWorld.width){ 
            this.x = gameWorld.x + gameWorld.width - this.width;
        }
        if(this.y + this.height > gameWorld.y1){ 
            this.y = gameWorld.y1 - this.height;
        }

    }
}
let camera = new Camera(0,0,canvas.width,canvas.height); 

//GameWorld class representing the entire game world
class GameWorld{
    constructor(x,width,height){
        this.x = x;
        this.y0 = canvas.height - height;
        this.y1 = canvas.height;
        this.width = width;
        this.height= height;
    }
}
let gameWorld = new GameWorld(0,gameObjectSize*mapCols,gameObjectSize*mapRows);

//Heart class Hearts == lives
class Heart{
    constructor(sourceX,sourceY,x,y){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.x = x;
        this.y = y;
        
        // constant variables
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize * 0.6;
        this.height = gameObjectSize * 0.6;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
    update(index){
        this.x = camera.x + index*this.width;
        this.y = camera.y + 10;
        //this.y = this.width;      
        switch(ball.live){   // the loop will never get to trial(ie hearts.length.)
            case index :
                this.sourceX = originalTileWidth;
                //this.sourceY = 1*originalTileHeight; this doesn't havr to change
                break;
            } 
    }
}     
//Fire class       
class Fire{
    constructor(sourceX,sourceY,col,row){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.col = col;
        this.row = row;
        this.x = col*gameObjectSize
        this.y = canvas.height - gameObjectSize*(mapRows-row)
        this.count = 0;
        this.frameIndex = 0;
        this.maxFrame = false;
        
        // constant variables
        this.delay = 10;
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize;
        this.height = gameObjectSize;
    }
    nextFrame(){
        if(this.maxFrame == true){
            this.frameIndex--;
        }else{
            this.frameIndex++;
        } 
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
    update(){
        this.count++;
        if(this.count >= this.delay){
            this.count = 0;
            if(this.frameIndex <= 0) this.maxFrame = false;
            if(this.frameIndex >= FIRE.length - 1) this.maxFrame = true;
            let currentFrame = FIRE[this.frameIndex];
            this.sourceX = Math.floor(currentFrame % tileInRow) *originalTileWidth;
            this.sourceY = Math.floor(currentFrame / tileInRow) *originalTileHeight;
            this.nextFrame();
            //console.log(this.frameIndex)
        }
    }
}
//Coin class
class Coin{
    constructor(sourceX,sourceY,col,row){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.col = col;
        this.row = row;
        this.x = col*gameObjectSize
        this.y = canvas.height - gameObjectSize*(mapRows-row)
        this.collected = false; 
        this.count = 0;
        this.frameIndex = 0;
        this.maxFrame = false;
        
        // constant variables
        this.delay = 10;
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = 20;//gameObjectSize;
        this.height = 20;//gameObjectSize;
    }
    nextFrame(){
        if(this.maxFrame == true){
            this.frameIndex--;
        }else{
            this.frameIndex++;
        } 
    }
    draw(){
        if(!this.collected){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
        }
    }
    update(){
        this.count++;
        if(this.count >= this.delay){
            this.count = 0;
            if(this.frameIndex <= 0) this.maxFrame = false;
            if(this.frameIndex >= COIN.length - 1) this.maxFrame = true;
            let currentFrame = COIN[this.frameIndex];
            this.sourceX = Math.floor(currentFrame % tileInRow) *originalTileWidth;
            this.sourceY = Math.floor(currentFrame / tileInRow) *originalTileHeight;
            this.nextFrame();
            //console.log(this.frameIndex)
        }
    }
}

// Credit class to count collected coin
class Credit{
    constructor(sourceX,sourceY,x,y){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.x = x;
        this.y = y;
        
        // constant variables
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize * 0.6;
        this.height = gameObjectSize * 0.6;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
        ctx.font = "16px serif";
        ctx.fillStyle = "white";
        ctx.fillText(collectedCredit, this.x + this.width + 5, this.y + gameObjectSize/2);
    }
    update(){
        this.x = camera.x;
        this.y = camera.y + gameObjectSize + 10         
        //ctx.fillText(collectedCredit,this.width + 5, this.y + gameObjectSize/2);    
    }
}


//Home
class Home{
    constructor(sourceX,sourceY,col,row){
        this.sourceX = sourceX;
        this.sourceY = sourceY;
        this.col = col;
        this.row = row;
        this.x = col*gameObjectSize
        this.y = canvas.height - gameObjectSize*(mapRows-row)
        
        // constant variables
        this.sourceDx = 64;
        this.sourceDy = 64;
        this.width = gameObjectSize;
        this.height = gameObjectSize;
    }
    draw(){
        ctx.drawImage(tileSheet,
                        this.sourceX,
                        this.sourceY,
                        this.sourceDx,
                        this.sourceDy,
                        this.x,this.y,
                        this.width,this.height);
    }
}

//<--------------------------------------------------------------------------------------------------------->
//createObjects function to create the objects from the map. see levels.js for maps
let ball; 
let credit;
let home;
function createObjects(levelMap){

    //map
    for(var row = 0; row < mapRows; row++){ 
        for(var col = 0; col < mapCols; col++){ 
            var currentTile = levelMap[row][col] - 1; //remove 1 
            if(currentTile != EMPTY){ 
                //Find the tile's X and Y positions on the sprite sheet 
                var sourceX = Math.floor(currentTile % tileInRow) *originalTileWidth;
                var sourceY = Math.floor(currentTile / tileInRow) *originalTileHeight;
                        
                switch (currentTile){ 						
                    case WALL.find(function(y){return y == currentTile;}): //checks if the currentTile is in the WALL array
                        var wall = new Wall(sourceX,sourceY,col,row);
                        objects.push(wall);
                        walls.push(wall);
                        break; 
                    case OBSTACLE.find(function(y){return y == currentTile;}): //checks if the currentTile is in the OBSTACLE array
                        var obstacle = new Obstacle(sourceX,sourceY,col,row);
                        objects.push(obstacle);
                        obstacles.push(obstacle);
                        break;
                    case FIRE.find(function(y){return y == currentTile;}): //checks if the currentTile is in the FIRE array
                        var fire = new Fire(sourceX,sourceY,col,row);
                        objects.push(fire);
                        fireArr.push(fire);
                        break; 
                    case COIN.find(function(y){return y == currentTile;}): //checks if the currentTile is in the COIN array
                        var coin = new Coin(sourceX,sourceY,col,row);
                        objects.push(coin);
                        coins.push(coin);
                        break;
                    case HOME:
                        home = new Home(sourceX,sourceY,col,row);
                        objects.push(home);
                }
            }
        }
    }



     // Other Objects that are not on the level map
    // ball object
    const ballSx = 256;
    const ballSy = 128;
    const ballInitX = 50;
    const ballInitY =  canvas.height/2;
    ball = new Ball(ballSx,ballSy,ballInitX, ballInitY);
    objects.push(ball);

    // Setting the hearts in place
    const heartSx = 0;
    const heartSy = 256;
    const heartY =  5;
    for(var i = 0; i < trial; i++){
        let heart = new Heart(heartSx, heartSy,i * gameObjectSize,heartY);
        objects.push(heart);
        hearts.push(heart);
    }

    // the credit count icon and value
    const creditSx = 0;
    const creditSy = 128;
    const creditInitX = 0;
    const creditInitY =  10 + gameObjectSize;
    credit = new Credit(creditSx,creditSy,creditInitX,creditInitY);
    objects.push(credit);

    console.log("loading complete");
    logedState = false;
    gameState = STATE_READY;
}



function render(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the screen
    if(gameState != STATE_PAUSED) ball.update();
    camera.update();
    for(var i = 0; i < hearts.length; i++){    
           hearts[i].update(i);
    }
    for(var i = 0; i < fireArr.length; i++){    
        fireArr[i].update();
    }
    for(var i = 0; i < coins.length; i++){    
        coins[i].update();
    } 
    credit.update();

    ctx.save();
    //Move the drawing surface so that it's positioned relative to the camera
    ctx.translate(-camera.x, -camera.y);
    // Draw all object in the object array
    if(objects.length != 0){
        objects.forEach(function(object){
            object.draw();
         });
     }

    ctx.restore();
 }



function animate(){
    requestAnimationFrame(animate);
    run();
}
animate();
}
