
function Asteroid(x, y, vx, vy ){
  this.x_coord = x;
  this.y_coord = y;
  this.vx = vx;
  this.vy = vy;

}

Asteroid.prototype.tic = function(){
  console.log("before coords: "+this.x_coord+", "+this.y_coord);
  this.x_coord += this.vx;
  this.y_coord += this.vy;
  console.log("after coords: "+this.x_coord+", "+this.y_coord);
};

var largeNumOfAsteroids = function(){
  var asteroids = [];
  for(var i = 0; i < 1000; i++ ){
    rand_x = Math.floor(Math.random()*100);
    rand_y = Math.floor(Math.random()*100);
    rand_vx = Math.floor( (Math.random()*5) +1 );
    rand_vy = Math.floor( (Math.random()*5) +1 );

    asteroids.push( new Asteroid(rand_x, rand_y, rand_vx, rand_vy));
  }
  return asteroids;
};

var asteroidBenchmarker = function(){

};







