/*
var socket = io.connect();

socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
*/

// Connect to server
var socket = io.connect();

var canvas = document.getElementById("canvas");
      
var stage = new createjs.Stage(canvas);

var loading = {};

loading.init = function() {
  
  //Create a Shape DisplayObject.
  var square = new createjs.Shape();
  square.graphics.beginFill("red").drawRect(0, 0, 100, 200);
  
  loading.square = square;
  //Add Shape instance to stage display list.
  stage.addChild(square);
  //Update stage will render next frame
  
  square.onClick = function() {
		console.log('yellow');
		square.graphics.beginFill("yellow").drawRect(0, 0, 100, 200);
  };
};

createjs.Ticker.addEventListener("tick", handleTick);

function handleTick() {
  stage.update();
}

loading.init();   

	
// Listen for state