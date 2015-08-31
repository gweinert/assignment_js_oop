
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

}

Asteroid.prototype.tic = function(){
  // console.log("before coords: "+this.x_coord+", "+this.y_coord);
  this.x_coord += this.vx;
  this.y_coord += this.vy;
  // console.log("after coords: "+this.x_coord+", "+this.y_coord);
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

Asteroid.prototype.randomize = function() {
  this.x_coord = Math.floor(Math.random()*400);
  this.y_coord = Math.floor(Math.random()*400);
  this.vx = Math.floor( (Math.random()*11) -5 );
  this.vy = Math.floor( (Math.random()*11) -5 );
  this.size = Math.floor( (Math.random()*20) + 1 );
};




function render() {
  
  var canvas = document.getElementById('board');
  var ctx = canvas.getContext("2d");
  var asteroids = [];
  for (var i=0; i<10; i++) {
    var a = new Asteroid();
    a.randomize();
    asteroids.push(a);
    ctx.beginPath();
    console.log(a);
    ctx.arc(a.x_coord, a.y_coord, a.size, 0, 2*Math.PI);
    ctx.stroke();
  }

  var gameLoop = setInterval( function() {
    for( var i = 0; i < asteroids.length; i++){
      asteroids[i].tic();
    }
  })
  
}








