//particles.js
//Adapted from emitter.js by Tony Jefferson

"use strict";

//Use the existing app if it does exist, otherwise make a new object literal
var app = app || {};

//Create particle effects
app.Particles = function() {
    
    //Constructor
    function Particles() {
        this.numParticles = 50; //The number of particles to draw
        this.range = 1; //The range of the particles
        this.speed = 3; //The speed/distance at which the particles move
        this.radius = 3; //The radius of the particles
        this.decay = 1; //The decay rate of the particles
        this.lifetime = 20; //The lifetime of the particles
        this.red = 0;
        this.blue = 0;
        this.green = 0;
        this.activated = false; //If the emitter is active or not
    }
    
    //Allow other scripts to access some methods from this script
    var particle = Particles.prototype;
    var particleArray = undefined;
    
    //Initialize the particles
    particle.initialize = function(xPosition, yPosition) {
        particleArray = []; //Initialize the array of particles
        
        //Initialize each particle and add it to the array of particles
        for (var i = 0; i < this.numParticles; i++) {
            var newParticle = {}; //Make a new particle
            
            //Assign attributes to the particle
            newParticle.age = Math.random(0, this.lifetime);	
            newParticle.x = xPosition + (Math.random() * this.range);
            newParticle.y = yPosition + (Math.random() * this.range);
            newParticle.r = Math.random() * this.radius;
            
            //Randomly assign the particle direction
            var randomParticleDirection = Math.floor(Math.random() * 4); //0-3
            if (randomParticleDirection == 0) {
                newParticle.xSpeed = Math.random() * this.speed;
                newParticle.ySpeed = Math.random() * this.speed;
            }
            else if (randomParticleDirection == 1) {
                newParticle.xSpeed = Math.random() * -this.speed;
                newParticle.ySpeed = Math.random() * this.speed;
            }
            else if (randomParticleDirection == 2) {
                newParticle.xSpeed = Math.random() * this.speed;
                newParticle.ySpeed = Math.random() * -this.speed;
            }
            else if (randomParticleDirection == 3) {
                newParticle.xSpeed = Math.random() * -this.speed;
                newParticle.ySpeed = Math.random() * -this.speed;
            }
            
            Object.seal(newParticle); //Prevent the particle from being added to
            
            particleArray.push(newParticle); //Add the particle to the array
        }
        
        this.activated = true;
    }
    
    particle.update = function(ctx) {
        //Stop updating if all particles have been removed
        if (particleArray.length <= 0) {
            this.numParticles = 50;
            this.activated = false;
        }
        else {
            for (var i = 0; i < this.numParticles; i++) {
                var p = particleArray[i]; //Get a single particle

                //Update the particle
                p.age += this.decay;
                p.x += p.xSpeed;
                p.y += p.ySpeed;

                var alpha = 1 - p.age/this.lifetime; //Fade out the particle

                ctx.fillStyle = "rgba(" + this.red + ", " + this.green + ", " + this.blue + ", " + alpha + ")"; //Assign the color of this particle

                //Draw the particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();

                //Remove the particle if it is too old
                if (p.age >= this.lifetime) {
                    particleArray.splice(i, 1);
                    this.numParticles--;
                }
            }
        }
    }
    
    return Particles; //Return the particles
}();