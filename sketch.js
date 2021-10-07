// Interative Scene
// Aaron Su
// October 4, 2021

// Extra for Experts:
// The Extra for Experts criteria has been attempted by adding sound effects to the interactive scene and allowing the size of the visuals to adapt according to the screen size.

//initiating variables for the ship
let x, y, shipWidth, shipHeight, shipHit, bulletOneX, bulletOneY;
let shootOne = false;
let leftOpen = false;
let rightOpen = true;

//initiating variables for the enemy 
let enemyWidth, enemyHeight, enemyDirection, enemyHit, enemyBulletOneX, enemyBulletOneY,enemyBulletSpeed, enemyBulletWidth, enemyBulletHeight, enemyX;
let enemyY = 0;    
let enemyShootOne = false;

//initiating images
let ship, bgOne, bgTwo, bgThree, bullet, laser, explosion, bgm;

//initiating variables of the background 
let bgOneX = 0;
let bgOneY = 0;
let bgTwoX = 0;
let bgTwoY;

//initiating else
let previousTime = 0;
let level = 1;
let canvasWidth;
let time; 
let gameStart = false;

function preload() {
  //loading images
  ship = loadImage('assets/spaceship.png');
  bgOne = loadImage('assets/background.png');
  bgTwo = loadImage('assets/background.png');
  enemy = loadImage('assets/enemy.png');
  bullet = loadImage('assets/bullet.png')
  
  //loading sound
  soundFormats('ogg');
  laser = loadSound('assets/laser.mp3');
  explosion = loadSound('assets/explosion.mp3');
}

function setup() {
  createCanvas(windowHeight * 0.75, windowHeight);

  canvasWidth = windowHeight * 0.75;

  bgTwoY = -windowHeight

  //setting variables of the ship
  x = 0;
  y = windowHeight/(600/500);
  shipWidth = canvasWidth/(400/80);
  shipHeight = windowHeight/(600/80);
  shipHit = 0;

  //setting variables of enemy
  enemyWidth = canvasWidth/8;
  enemyHeight = windowHeight/12;
  enemyDirection = 1;
  enemyHit = 0;
  enemyBulletSpeed = windowHeight/(600/5);
  enemyBulletWidth = canvasWidth/(400/10);
  enemyBulletHeight = windowHeight/(600/20); 
  }

function draw() {
  //before game starts
  if (gameStart === false) {
    backGround();
    textSize(windowHeight/(600/30));
    stroke(255);
    fill(255);
    textAlign(CENTER);
    text('Click on Screen to Start', canvasWidth/2, windowHeight/2);
  }
  
  //in game
  else if (gameStart) {
    if (shipHit <= 2) {
      backGround();
      drawObject();
      move();
      drawBullets();
      drawEnemyBullets();
      shooting();
      enemyBullet();
      enemies();
      data();
    }

    //game over
    else {
      textSize(windowHeight/(600/60));
      stroke(255);
      fill(255);

      textAlign(CENTER);
      text('GAME OVER', canvasWidth/2, windowHeight/2);
      
      textSize(windowHeight/(600/30))
      text('Click on Screen to Restart', canvasWidth/2, windowHeight/2 + (windowHeight/(600/60)));
    }
  }
}

//draw ship
function drawObject(){
  image(ship, x, y, shipWidth, shipHeight);
}

//movement of ship
function move() {
  if (keyIsDown(RIGHT_ARROW) && !keyIsDown(LEFT_ARROW) && rightOpen) {
    x += canvasWidth/(400/5);
  } 

  else if (keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && leftOpen) {
    x -= canvasWidth/(400/5);
  }
  
  if (x + shipWidth + canvasWidth/(400/5) >= canvasWidth) {
    rightOpen = false;
  }
  
  else if (x + canvasWidth/(400/5) <= canvasWidth) {
    rightOpen = true;
  }
  
  if (x - canvasWidth/(400/5) <= 0) {
    leftOpen = false;
  }
  
  else if (x - canvasWidth/(400/5) >= 0) {
    leftOpen = true;
  }
  
}

//drawing ship bullets
function drawBullets() {
  if (keyIsDown(UP_ARROW) && shootOne === false) {
    bulletOneX = x+shipWidth/2;
    bulletOneY = y;
    
    fill(0,255,0);
    rect(bulletOneX, bulletOneY, canvasWidth/(400/10), windowHeight/(600/5));
    shootOne = true;
    laser.play();
  }
}

//movement of ship bullets
function shooting() {
  if (shootOne === true) {
    bulletOneY -= windowHeight/(600/15);
    fill(0,255,0);
    rect(bulletOneX, bulletOneY, canvasWidth/(400/10), windowHeight/(600/15));
    
  }
    
  if (bulletOneY <= 0) {
    shootOne = false;
  } 
  
  if (bulletOneY <= enemyY +  windowHeight/(600/50) && bulletOneY -  windowHeight/(600/15) >= enemyY && bulletOneX + canvasWidth/(400/10) >= enemyX && bulletOneX <= enemyX + canvasWidth/(400/50)) {
    shootOne = false;
    enemyHit += 1;
    bulletOneY = 0;
    explosion.play();
  }
}


function enemies() {
  //drawing enemy
  if (enemyHit >= 1 && enemyHit <= 3) {
    image(enemy, enemyX, enemyY, enemyWidth, enemyHeight);
  }
  
  if (enemyY +  windowHeight/(600/3) <=  windowHeight/(600/70)) {
    enemyY +=  windowHeight/(600/3);
  }

  //movement of enemy
  enemyX += canvasWidth/(400/6) * enemyDirection;
  
  if (enemyX + enemyWidth/2 >= canvasWidth) {
    enemyDirection = -1;
  }

  else if (enemyX <= 0 -enemyWidth/2) {
    enemyDirection = 1;
  }
  
  //if enemy is demolished
  //increase in game difficulty 
  if (enemyHit >= 4) {
    enemyHit = 0;
    level += 1;
    if (level <= 6) {
      enemyBulletSpeed += 2;
      enemyBulletWidth = enemyBulletWidth * 1.5;
      enemyBulletHeight = enemyBulletHeight * 1.5;
    }
  }
  
  if (enemyHit === 0) {
    enemyX = random(0, canvasWidth);
    enemyHit += 1;
  }
}

function backGround() {
  //drawing background
  image(bgOne, bgOneX, bgOneY, canvasWidth, windowHeight);
  image(bgTwo, bgTwoX, bgTwoY, canvasWidth, windowHeight);
  
  //background moves to create the visualization that the ship and enemy is moving forward
  bgOneY +=  windowHeight/(600/3);
  bgTwoY +=  windowHeight/(600/3);
  
  if (bgOneY >=  windowHeight) {
    bgOneY = bgTwoY - windowHeight;
  }
  
  if (bgTwoY >=  windowHeight) {
    bgTwoY = bgOneY - windowHeight;
  }
}

function drawEnemyBullets() {
  //drawing ememy bullets and sound effects
  if (enemyShootOne === false) {
    enemyBulletOneX = enemyX+enemyWidth/2;
    enemyBulletOneY = enemyY;
    image(bullet, enemyBulletOneX, enemyBulletOneY, enemyBulletWidth, enemyBulletHeight);
    enemyShootOne = true;
    laser.play();
  }
}

function enemyBullet() {
  //movement of enemy bullets
  if (enemyShootOne === true) {
    enemyBulletOneY += enemyBulletSpeed;
    image(bullet, enemyBulletOneX, enemyBulletOneY, enemyBulletWidth, enemyBulletHeight);  
  }
  
  //when enemy bullet moves off the canvas
  if (enemyBulletOneY >= windowHeight) {
    enemyShootOne = false;
  } 
  
  //when enemy bullet hits ship
  if (enemyBulletOneY <= y + windowHeight/(600/70) && enemyBulletOneY + enemyBulletHeight >= y + windowHeight/(600/20) && enemyBulletOneX + enemyBulletWidth >= x + shipWidth/4 && enemyBulletOneX <= x + canvasWidth/(400/40)) {
    shootOne = false;
    shipHit += 1;
    explosion.play();
    enemyBulletOneY = enemyY + enemyHeight;
    enemyBulletOneX = enemyX + enemyWidth /2;
    
  }
}
  function data() {
    //displays the time of the game
    time = round(millis()/1000) - round(previousTime/1000);
    textSize(windowHeight/(600/20));
    stroke(255);
    fill(255);
    textAlign(RIGHT);
    text('TIME: ' + time, 0.75 * canvasWidth/3, windowHeight/20);
    
    //displays the level of the game
    textSize(windowHeight/(600/20));
    stroke(255);
    fill(255);
    textAlign(RIGHT);
    text('LEVEL: ' + level, 1.75 * canvasWidth/3, windowHeight/20);
    
    //displays the number of lives
    textSize(windowHeight/(600/20));
    stroke(255);
    fill(255);
    textAlign(RIGHT);
    text('LIVES: ' + (3-shipHit), 2.75 * canvasWidth/ 3, windowHeight/20);
    
  }

//restarts game
function mouseClicked() {
  //resets all variables when mouse is clicked
  gameStart = true;
  previousTime = millis()
  shipHit = 0;
  enemyHit = 0;
  level = 1;
  time = 0;
  lives = 3;
  enemyBulletSpeed = windowHeight/(600/5);
  enemyBulletWidth = canvasWidth/(400/10);
  enemyBulletHeight = windowHeight/(600/20);
  x = 0;
  y = windowHeight/(600/500);
  let enemyX;
  let enemyY = 0;
  enemyBulletOneX = enemyX+enemyWidth/2;
  enemyBulletOneY = enemyY;
  time = millis() - previousTime;
}

