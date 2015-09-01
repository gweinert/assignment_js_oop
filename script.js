
function Asteroid(x, y, vx, vy, size){
  this.x_coord = x;
  this.y_coord = y;
  this.vx = vx;
  this.vy = vy;
  this.size = size;
  // this.tic = function() {
  //   this.x_coord += this.vx;
  //   this.y_coord += this.vy;
  // };

};

Asteroid.prototype.tic = function(){
  // console.log("before coords: "+this.x_coord+", "+this.y_coord);
  this.x_coord = (this.x_coord+this.vx)%400;
  this.y_coord = (this.y_coord+this.vy)%400;
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
  // this.angle += this.angularVelocity;
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

  init: function() {
    for (var i=0; i<3; i++) {
      var a = new Asteroid();
      a.randomize();
      this.asteroids.push(a);
    }
    this.createSpaceship();
  },

  createSpaceship: function() {
    this.spaceShip = new Spaceship(400/2, 400/2);
  },


  collision: function(asteroid) {

    if(asteroid.size > 1){
      this.createSmallerAsteroids(asteroid);
      asteroid.vx =  Math.floor( (Math.random()*11) -5 );
      asteroid.vy =  Math.floor( (Math.random()*11) -5 );
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
    astroid.size = Math.floor( (Math.random()*(size)) );

  },

  addPieces: function() {
    // console.log(this.pieces);
    this.asteroids = this.asteroids.concat(this.pieces);
    this.pieces = [];
  },

  checkCollision: function(asteroid1, asteroid2) {
    // console.log("asteroid1" + asteroid1.size);
    // console.log("asteroid2" + asteroid2.size);
    if (asteroid1.size === 0 || asteroid2.size === 0) {return false;}
    var distance = Math.floor(Math.sqrt(Math.pow((asteroid1.x_coord - asteroid2.x_coord), 2) + Math.pow((asteroid1.y_coord - asteroid2.y_coord), 2)));
    return distance <= asteroid1.size + asteroid2.size;
  }

};


var view = {
  
  ctx: document.getElementById('board').getContext("2d"),


  render: function(asteroids, spaceShip) {
    var ctx = this.ctx;
    ctx.clearRect(0, 0, 400, 400);

    ctx.save();
    ctx.translate(spaceShip.x_coord,spaceShip.y_coord);
    ctx.rotate(model.spaceShip.angle*Math.PI/180);
    ctx.translate(-spaceShip.x_coord,-spaceShip.y_coord);

    var path=new Path2D();
    // path.moveTo(spaceShip.x_coord - 20,spaceShip.y_coord - 20);
    // path.lineTo(spaceShip.x_coord + 20,spaceShip.y_coord + 20);
    // path.lineTo(spaceShip.x_coord + 20,spaceShip.y_coord - 20);
    // ctx.fill(path);

    path.moveTo(spaceShip.x_coord ,spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2 );
    path.lineTo(spaceShip.x_coord + (15/2), (spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2) - 20);
    path.lineTo(spaceShip.x_coord - (15/2), (spaceShip.y_coord + (Math.sqrt(400 - (15/2)^2))/2) - 20);
    ctx.fill(path);
    

    // var img = new Image();
    // img.onload = function() {
    //   ctx.drawImage(img, spaceShip.x_coord, spaceShip.y_coord, 50, 50);
    // };
    // img.src = "spaceShip.png";

    ctx.restore();

    

    for (var i=0; i<asteroids.length; i++) {
      ctx.beginPath();
      // console.log(asteroids[i]);
      ctx.arc(asteroids[i].x_coord, asteroids[i].y_coord, asteroids[i].size, 0, 2*Math.PI);
      ctx.stroke();
    }
  },



};


var controller = {

  // keys: {
  //   37: controller.rotateLeft,
  //   38: controller.accelerate,
  //   39: controller.rotateRight
  // },

  init: function() {
    // $(document).keydown(function(e) {
    //   controller.keys[e.keyCode]();
    // });

    $(document).keydown(function(e) {
      switch (e.keyCode) {
          case 37:
              console.log('left');
              controller.rotateLeft();
              break;
          case 38:
              console.log('up');
              controller.accelerate();
              break;
          case 39:
              console.log('right');
              controller.rotateRight();
              break;
          case 32:
            console.log("fire");
            controller.shoot();
            break;
          // case 40:
          //     alert('down');
          //     break;

      }
      e.preventDefault();
    });
    model.init();
    view.render(model.asteroids, model.spaceShip);
  },

  play: function() {
    var gameLoop = setInterval( function() {
      for( var i = 0; i < model.asteroids.length; i++){
        model.asteroids[i].tic();

        for (var j=i+1; j < model.asteroids.length; j++) {
          if (model.checkCollision(model.asteroids[i], model.asteroids[j])) {
            model.collision(model.asteroids[i]);
            model.collision(model.asteroids[j]);
          }
        }

      }

      model.addPieces();
      console.log("num of asteroids " + model.asteroids.length);

      model.spaceShip.tic();

      view.render(model.asteroids, model.spaceShip);
    }, 100);
  },

  rotateLeft: function() {
    model.spaceShip.rotate(-10);
    // view.drawRotated(model.spaceShip.angle)
  },

  rotateRight: function() {
    model.spaceShip.rotate(10);
    // view.drawRotated(model.spaceShip.angle)
  },

  accelerate: function() {
    console.log("accel!");
    model.spaceShip.accelerate();
  },

  shoot: function() {
    var a = new Asteroid(model.spaceShip.x_coord, model.spaceShip.y_coord, (model.spaceShip.vx*2)+ (5)*(Math.sin(this.angle*Math.PI/180)), (model.spaceShip.vy*2) + (5)*Math.cos(this.angle*Math.PI/180), 3 );
    model.asteroids.push(a);

  }
  
};





