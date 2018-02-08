"use strict";

var app = app || {};

app.Keys = function(){
	var keys = {};
	
	keys.keydown = [];
	keys.pName = [];
	
	//Key down event listener
	window.addEventListener("keydown", function(e){
		keys.keydown[e.keyCode] = true;
	});
	
	//key up event listener
	window.addEventListener("keyup", function(e){
		keys.keydown[e.keyCode] = false;
	});
	
	//Gamover Keyboard down func
	function gameOverKeyDown(e){
		keys.keydown[e.keyCode] = true;
		if(app.main.newHighScore){
			if(keys.keydown[13] && keys.keydown[16]){ //enter pressed
				//add new player to the high scores array
				var player = new app.main.PLAYER();
				player.name = "";
				
				for(var i = 0; i < keys.pName.length; i++){
					player.name += keys.pName[i];
				}
				
				player.score = app.main.score;
				
				app.main.highScores.push(player);
				keys.pName = [];
				
				//set new highscore to false
				app.main.newHighScore = false;
			}
			else if(e.keyCode == 8){
				if(keys.pName.length != 0){
					keys.pName.pop();
				}
			}
			else if(keys.pName.length < 3 && (e.keyCode >= 65 && e.keyCode <= 90) ) {
				keys.pName.push(String.fromCharCode(e.keyCode));
			}
		}
	};
	
	keys.gameOverKeydown = gameOverKeyDown;
		   
	return keys;
}();
