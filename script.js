$(document).ready(function(){
  controller.init();
});


function Asteroid(x, y, vx, vy, size){
  this.x_coord = x;
  this.y_coord = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
  this.bullet = false;
  // this.tic = function() {
  //   this.x_coord += this.vx;
  //   this.y_coord += this.vy;
  // };

}

Asteroid.prototype.tic = function(){
  // console.log("before coords: "+this.x_coord+", "+this.y_coord);
  this.x_coord = (this.x_coord+this.vx)%400;
  this.y_coord = (this.y_coord+this.vy)%400;

  if (this.x_coord < 0 ){
    this.x_coord = 400;
  }
  if (this.y_coord < 0 ) {
    this.y_coord = 400;
  }

  // console.log("after coords: "+this.x_coord+", "+this.y_coord);
};

Asteroid.prototype.randomize = function() {
  this.x_coord = Math.floor(Math.random()*400);
  this.y_coord = Math.floor(Math.random()*400);
  this.vx = Math.floor( (Math.random()*11) -5 );
  this.vy = Math.floor( (Math.random()*11) -5 );
  this.size = Math.floor( (Math.random()*20) + 2 );
};

function Spaceship(x , y){
  this.x_coord = x;
  this.y_coord = y;
  this.vx = 0;
  this.vy = 0;
  this.angle = 180;
  this.angularVelocity = 0;
  this.acceleration = 1;
}

Spaceship.prototype.tic = function() {
  this.x_coord = (this.x_coord+this.vx)%400;
  this.y_coord = (this.y_coord+this.vy)%400;
  ////////
  if (this.x_coord < 0 ){
    this.x_coord = 400;
  }
  if (this.y_coord < 0 ) {
    this.y_coord = 400;
  }
};

Spaceship.prototype.rotate = function(direction) {
  // this.angularVelocity += direction;
  this.angle += direction;
  console.log("spaceship angle = "+this.angle);
};

Spaceship.prototype.accelerate = function() {
  this.vx -= this.acceleration*Math.sin(this.angle*Math.PI/180);
  this.vy += this.acceleration*Math.cos(this.angle*Math.PI/180);
};




// var largeNumOfAsteroids = function(){
//   var asteroids = [];
//   for(var i = 0; i < 1000; i++ ){
//     rand_x = Math.floor(Math.random()*100);
//     rand_y = Math.floor(Math.random()*100);
//     rand_vx = Math.floor( (Math.random()*5) +1 );
//     rand_vy = Math.floor( (Math.random()*5) +1 );

//     asteroids.push( new Asteroid(rand_x, rand_y, rand_vx, rand_vy));
//   }
//   return asteroids;
// };

// var asteroidBenchmarker = function(asteroids){
//   var startTime, endTime;
//   startTime = new Date().getTime();
//   for (var i=0; i<asteroids.length; i++) {
//     for (var j=0; j<10000; j++) {
//       asteroids[i].tic();
//     }
//   }
//   endTime = new Date().getTime();
//   return (endTime - startTime);
// };


var model = {

  asteroids: [],
  pieces: [],
  spaceShip: {},
  score: 0,

  init: function() {
    for (var i=0; i<9; i++) {
      var a = new Asteroid();
      a.randomize();
      this.asteroids.push(a);
    }
    this.createSpaceship();
  },

  createSpaceship: function() {
    this.spaceShip = new Spaceship(400/2, 400/2);
  },


  collision: function(asteroid, otherAsteroid) {

    if(asteroid.size > 1){
      this.createSmallerAsteroids(asteroid);
      asteroid.vx =  Math.floor( (Math.random()*11) -5 );
      asteroid.vy =  Math.floor( (Math.random()*11) -5 );
      // asteroid.vx = asteroid.vx * (-1*(otherAsteroid.vx));
      // asteroid.vy = asteroid.vy * (-1*(otherAsteroid.vy));
      // if(asteroid.size > otherAsteroid.size){
      //   asteroid.size -= 1;
      //   otherAsteroid.size -= 2;
      // }
      // else{
      //   otherAsteroid.size -= 1;
      //   asteroid.size -= 2;
      // }
      asteroid.size = Math.floor( (Math.random()*(asteroid.size)) );
    } else {
      asteroid.size = 0;
    }

  },

  createSmallerAsteroids: function(asteroid){
    randonNumOfAsteroids = Math.floor( (Math.random() * 3) +1);

    for( var i = 0 ; i < randonNumOfAsteroids ; i++ ){
      var newAstroid = new Asteroid();
      this.randomizeCollisionAsteriods(newAstroid, asteroid.size);
      if (newAstroid.size > 1) {
        model.pieces.push(newAstroid);
      }
    }

  },

  randomizeCollisionAsteriods: function(astroid, size){
    astroid.vx = Math.floor( (Math.random()*11) -5 );
    astroid.vy = Math.floor( (Math.random()*11) -5 );
    astroid.size = Math.floor( (Math.random()*(size)) +1 );

  },

  addPieces: function() {
    this.asteroids = this.asteroids.concat(this.pieces);
    this.pieces = [];
  },

  checkCollision: function(asteroid1, asteroid2) {

    if (asteroid1.size === 0 || asteroid2.size === 0) {return false;}
    var distance = Math.floor(Math.sqrt(Math.pow((asteroid1.x_coord - asteroid2.x_coord), 2) + Math.pow((asteroid1.y_coord - asteroid2.y_coord), 2)));
    return distance <= asteroid1.size + asteroid2.size;
  }

};


var view = {
  
  ctx: document.getElementById('board').getContext("2d"),

  rockets: false,


  render: function(asteroids, spaceShip) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, 400, 400);

    //allows ship to rotate while rest of level stays still
    ctx.save();
    ctx.translate(spaceShip.x_coord,spaceShip.y_coord);
    ctx.rotate(model.spaceShip.angle*Math.PI/180);
    ctx.translate(-spaceShip.x_coord,-spaceShip.y_coord);

    var path=new Path2D();

    //trying to draw isoclos triangle
    path.moveTo(spaceShip.x_coord ,spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2 );
    path.lineTo(spaceShip.x_coord + (15/2), (spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2) - 20);
    path.lineTo(spaceShip.x_coord - (15/2), (spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2) - 20);
    ctx.fill(path);

    //if accelerating rockets are rendered
    if(this.rockets){
      ctx.rect(spaceShip.x_coord - (15/2), (spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2) - 20, 15, -10);
      ctx.stroke();
    }

    ctx.restore();

    //render all asteroids
    for (var i=0; i<asteroids.length; i++) {
      ctx.beginPath();
      ctx.arc(asteroids[i].x_coord, asteroids[i].y_coord, asteroids[i].size, 0, 2*Math.PI);
      ctx.stroke();
    }
  },

  updateScore: function(){
    $('.score-count').html(model.score);
  }

  // rockets: function(){
  //   var ctx = this.ctx;
  //   ctx.rect(20, 20, 150, 100);
  //   ctx.stroke();
  //   console.log("ROCKET");
  //   // var path=new Path2D();
  // }



};


var controller = {


  init: function() {

    $(document).keydown(function(e) {
      switch (e.keyCode) {
          case 37:
              // console.log('left');
              controller.rotateLeft();
              break;
          case 38:
              // console.log('up');
              controller.accelerate();
              view.rockets = true;
              break;
          case 39:
              // console.log('right');
              controller.rotateRight();
              break;
          case 32:
            // console.log("fire");
            controller.shoot();
            break;

      }
      e.preventDefault();
    });

    $(document).keyup(function(e) {
      switch (e.keyCode) {
          case 38:
          view.rockets = false;
          break;
        }
      e.preventDefault();
    });
    
    model.init();
    view.render(model.asteroids, model.spaceShip);
    this.play();
  },

  play: function() {
    var gameLoop = setInterval( function() {
      // console.log("x: "+ model.spaceShip.x_coord);
      // console.log("y: "+ model.spaceShip.y_coord);
      for( var i = 0; i < model.asteroids.length; i++){
        model.asteroids[i].tic();

        for (var j=i+1; j < model.asteroids.length; j++) {
          if (model.checkCollision(model.asteroids[i], model.asteroids[j])) {

            if(model.asteroids[i].bullet){
              model.asteroids[i].size = 0;
              model.collision(model.asteroids[j], model.asteroids[i]);
              model.score++;
            }
            else if(model.asteroids[j].bullet){
              model.asteroids[j].size = 0;
              model.collision(model.asteroids[i], model.asteroids[j]);
              model.score++;
            }
            else{
              model.collision(model.asteroids[i], model.asteroids[j]);
              model.collision(model.asteroids[j], model.asteroids[i]);
            }
          }
        }

      }

      model.addPieces();
      // console.log("num of asteroids " + model.asteroids.length);

      model.spaceShip.tic();

      view.render(model.asteroids, model.spaceShip);
      view.updateScore();
    }, 100);
  },

  rotateLeft: function() {
    model.spaceShip.rotate(-10);
  },

  rotateRight: function() {
    model.spaceShip.rotate(10);
  },

  accelerate: function() {
    // console.log("accel!");
    model.spaceShip.accelerate();
  },

  shoot: function() {
    // var a = new Asteroid(model.spaceShip.x_coord, model.spaceShip.y_coord, (model.spaceShip.vx*2)+ (5)*(Math.sin(this.angle*Math.PI/180)), (model.spaceShip.vy*2) + (5)*Math.cos(this.angle*Math.PI/180), 3 );
    var a = new Asteroid(model.spaceShip.x_coord, model.spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2, (10)*(Math.cos( (model.spaceShip.angle+90)*Math.PI/180)), (10)*(Math.sin((model.spaceShip.angle+90)*Math.PI/180)), 2);

    a.bullet = true;
    console.log(a.bullet);
    // console.log("shot vx: "+(-10-model.spaceShip.vx)*-(Math.sin((model.spaceShip.angle+90)*Math.PI/180)) );
    // console.log("shot vy: "+(10+model.spaceShip.vy)*(Math.cos((model.spaceShip.angle+90)*Math.PI/180)) );
    model.asteroids.push(a);

  }
  
};





