var balls = [];
var isHitting = false; //if in the middle of hitting animation
var isStill = true; //if no balls are moving
var isScratch = false; //if white ball has gone out
var player = -1; //which player is going
var storeSo = 7; //stores the total number of solids between turns
var storeSt = 7; //stores the total number of stripes between turns
var youLose = false; //check if game is over
var p1Done = false; //check if play 1 has gotten all the stripes
var p2Done = false; //check if player 2 has gotten all the solids

var poolStick = {
  rotation:0,
  time:-49,
  display: function(){
    fill(255);
    push();
    translate(balls[0].x,balls[0].y);
    rotate(atan2(mouseY-balls[0].y,mouseX-balls[0].x));
    rect(120-abs(this.time),0,100,10);
    rect(-325,0,600,25);
    pop();
  },
  hit: function(){
    balls[0].angle = degrees(atan2(balls[0].y-mouseY,balls[0].x-mouseX));
    balls[0].speed = (50-abs(this.time))/5;
    isHitting = false;
    this.time = -50;
  },
  hitting: function(){
    this.time++;
    textSize(15);
    fill(0);
    text(round(50-abs(this.time)),balls[0].x, balls[0].y+25)
    if(this.time>=40){
      this.hit();
    }
  }
}

function preload(){
}

function setup() {
  createCanvas(1200,700);
  colorMode(HSB,255);
  rectMode(CENTER);
  textAlign(CENTER,CENTER);
  reset();
}

function draw() {
  table(); //display stuff
  poolballs(); //pool ball stuff
  betweenTurns(); //what happens between turns
}

function table(){
  background(255);
  fill(0);
  rect(600,75,100,50);
  rect(600,700,100,100);
  rect(1100,100,100,100);
  rect(100,100,100,100);
  rect(1100,650,100,100);
  rect(100,650,100,100);
  textSize(60);
  text("Player: " + (player+3)/2, 300,50);
  fill(120,255,255);
  rect(600,375,1000,550);
}

function poolballs(){
  for(var i=0; i<balls.length; i++){
    balls[i].display();
    balls[i].move(); //balls moving
    balls[i].bounce(); //balls hitting sides
    balls[i].friction(); //balls constantly slowing down
    balls[i].contact(); //balls hitting
    balls[i].out(); //balls leaving play area
    if(balls[i].isOut){
      if(i!=0 && i!=1){ //removes ball if out of play area and not the white or eight ball
        balls.splice(i, 1);
      }else{
        balls[i].speed = 0; //stopes white or eight ball
      }
    }
  }
}

function betweenTurns(){
  if(still()){ //checks if turn has ended
    if(balls[0].isOut || isScratch){ //checks if white ball went in hole
      isScratch = true;
    }else{
      poolStick.display();
    }
    if(balls[1].isOut && !youLose){ //checks if eight ball went out
      if(player == -1){
        if(p1Done){ //check for on eight ball
          player*=-1
        }
      }else if(player == 1){
        if(p2Done){ //check for one eight ball
          player*=-1
        }
      }
      youLose=true;
    }
    if(!isStill && !youLose){
      scored(); //check how many of each balls were stored that round
    }
    isStill = true;
  }else{
    isStill=false;
  }
  if(isScratch){
    scratch() //putting white ball back
  }
  if(isHitting){
    poolStick.hitting();
  }
  if(youLose){
    background(255);
    fill(0);
    text("Player " + ((player*-1)+3)/2 + ", You Win",600,375);
    text("Press any key to Continue",600,425);
  }
}

function mousePressed(){
  if(youLose){
    reset();
  }else if(isHitting){
    poolStick.hit();
  }else if(isStill && !isScratch){
    isHitting=true;
  }
  if(isScratch){
    for(var i = 1; i<balls.length; i++){
      if(sqrt(sq(balls[0].x-balls[i].x) + sq(balls[0].y-balls[i].y))<=15){
        balls[0].x+=50;
      }
    }
    isScratch = false;
  }
}

function keyPressed(){
  if(key == "r" || youLose){
    reset();
  }
}

function reset(){
  storeSo = 7;
  storeSt = 7;
  youLose = false;
  player = -1;
  balls[0] = new Ball(200,375,"white",'white')
  balls[1] = new Ball(860,375,"eight",'black');
  balls[2] = new Ball(805,375,"stripes",'red');
  balls[3] = new Ball(890,395,"stripes",'purple');
  balls[4] = new Ball(920,305,"stripes",'blue');
  balls[5] = new Ball(920,375,"stripes",'yellow');
  balls[6] = new Ball(860,340,"stripes",'green');
  balls[7] = new Ball(860,410,"stripes",'orange');
  balls[8] = new Ball(920,445,"stripes",'brown');
  balls[9] = new Ball(832,355,"solid",'purple');
  balls[10] = new Ball(890,320,"solid",'blue');
  balls[11] = new Ball(920,410,"solid",'yellow');
  balls[12] = new Ball(920,340,"solid",'green');
  balls[13] = new Ball(890,430,"solid",'orange');
  balls[14] = new Ball(832,395,"solid",'brown');
  balls[15] = new Ball(890,355,"solid",'red');
}

function scratch(){
  textSize(32);
  text("Scratch",600,375);
  if(mouseY>110 && mouseY<640){
    balls[0].y = mouseY;
  }else{
    balls[0].y = (((abs(mouseY-110)/(mouseY-110))+1)*265)+110
  }
  if(mouseX>110 && mouseX<400){
    balls[0].x = mouseX;
  }else{
    balls[0].x = (((abs(mouseX-110)/(mouseX-110))+1)*145)+110
  }
  balls[0].speed = 0;
}

function scored(){
  var checkSt = 0;
  var checkSo = 0;
  for(var i = 0; i<balls.length; i++){
    if(balls[i].type == "stripes"){
      checkSt++;
    }
    if(balls[i].type == "solid"){
      checkSo++;
    }
  }
  if(player == -1){
    if(checkSt==storeSt || isScratch){
      player*=-1
    }
  }else{
    if(checkSo==storeSo || isScratch){
      player*=-1
    }
  }
  storeSt=checkSt;
  storeSo=checkSo;
  if(storeSt == 0){
    p1Done = true;
  }
  if(storeSo == 0){
    p2Done = true;
  }
}

function still(){
  for(var i=0; i<balls.length; i++){
    if(balls[i].speed>0){
      return false;
    }
  }
  return true;
}

function Ball(x,y,type,colors){
  this.x=x;
  this.y=y;
  this.angle = 0;
  this.speed = 0;
  this.storeSpeed = 0;
  this.time=20;
  this.isOut = false;
  this.type = type;
  this.color = colors;
  this.display= function(){
    if(this.type == "stripes"){
      fill(255);
      ellipse(this.x,this.y,30);
      fill(this.color);
      rect(this.x,this.y,13,25);
      push();
      noStroke()
      ellipse(this.x,this.y+10,12)
      ellipse(this.x,this.y-10,12)
      pop();
    }else if(this.type =="eight"){
      fill(this.color);
      ellipse(this.x,this.y,30);
      textSize(20);
      fill(255);
      text("8",this.x,this.y);
    }else{
      fill(this.color);
      ellipse(this.x,this.y,30);
    }
  };
  this.move = function(){
    this.x += cos(radians(this.angle)) * this.speed;
    this.y += sin(radians(this.angle)) * this.speed;
  };
  this.bounce = function(){
    if(this.hole()){ //checks if Ball is in hole
    }else{
      if(this.y>=640){
        this.angle *= -1;
        this.speed -= .0001
      }
      if(this.y<=110){
        this.angle *= -1;
        this.speed -= .0001
      }
      if(this.x>=1085){
        this.angle = 180-this.angle;
        this.speed -= .0001
      }
      if(this.x<=115){
        this.angle = 180-this.angle;
        this.speed -= .0001
      }
    }
  };
  this.friction = function(){
    if(this.speed>0){
      this.speed -=.01;
    }else{
      this.speed = 0;
    }
  };
  this.contact = function(){
    for(var i=0; i<balls.length; i++){
      if((this.x-balls[i].x)*(this.x-balls[i].x) + (this.y-balls[i].y)*(this.y-balls[i].y)<=900 && this !=balls[i] && this.time>=5){
        var aOC = degrees(atan2(balls[i].y-this.y,balls[i].x-this.x));
        this.storeSpeed = this.speed;
        this.speed -= this.speed/(abs(this.angle-aOC)/20+1);
        this.speed/=1.2;
        balls[i].speed = this.storeSpeed;
        balls[i].angle = aOC
      }
    }
  };
  this.out = function(){
    if(this.x>1100 || this.x<100 || this.y<105 || this.y>650){
      this.isOut=true;
    }else{
      this.isOut=false;
    }
  };
  this.hole = function(){
    if(this.x>=1050 && this.y>=600){
      return true;
    }else if(this.x<=150 && this.y>=600){
      return true;
    }else if(this.x<=650 && this.x>=550){
      return true;
    }else if(this.x<=150 && this.y<=140){
      return true;
    }else if(this.x>=1050 && this.y<=140){
      return true;
    }else{
      return false;
    }
  };
}
