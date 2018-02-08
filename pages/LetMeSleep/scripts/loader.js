"use strict";

//Use the existing app if it does exist, otherwise make a new object literal
var app = app || {};

//When the page loads, begin the game
window.onload = function() {
    //Load resources here
	//debugger;
    app.sound.init();
	app.main.sound = app.sound;
	app.main.keys = app.Keys;
    app.main.Particles = app.Particles; //Load the particles script
    app.main.init(); //Begin the game
	
}

//When the window running the game leaves focus
window.onblur = function() {
    app.main.pauseGame(); //Pause the game
}

//When the window running the game returns to focus
window.onfocus = function() {
    app.main.resumeGame(); //Resume the game
}