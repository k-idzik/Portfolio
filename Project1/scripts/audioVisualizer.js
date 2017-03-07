(function ()
{
    "use strict";
    window.onload = init; //Call init when the window loads

    //Canvas
    var canvas; //The canvas
    var ctx; //Canvas context
    
    //Audio
    var NUM_SAMPLES = 256;
    var SOUND_1 = 'media/New Adventure Theme.mp3';
    var SOUND_2 = 'media/Peanuts Theme.mp3';
    var SOUND_3 = 'media/The Picard Song.mp3';
    var audioElement; //The audio element on the page
    var analyserNode;
    var fadeCount = 1;
    
    //Effects
    var bars = true;
    var lineform = false;
    var invert = false;
    var noise = false;
    var scheme = "lime";

    //Initialization function
    function init()
    {
        canvas = document.querySelector('canvas');
        ctx = canvas.getContext("2d");

        audioElement = document.querySelector("audio"); //Get a reference to the audio element on the page
        analyserNode = createWebAudioContextWithAnalyserNode(audioElement); //Create an analyser node
        
        visualizerUI(); //Visualizer UI setup

        playStream(audioElement, SOUND_1); //Load and play the default sound
        
        canvasInteraction(); //Can interact with the canvas

        // start animation loop
        update();
    }
    
    //Create an analyser node
    function createWebAudioContextWithAnalyserNode(audioElement)
    {
        var audioCtx; //Audio context
        var analyserNode;
        var sourceNode;
        
        audioCtx = new (window.AudioContext || window.webkitAudioContext); //Create new AudioContext if supported

        analyserNode = audioCtx.createAnalyser(); //Create an analyser node

        analyserNode.fftSize = NUM_SAMPLES; //Fast Fourier Transform size

        //Hook up the audio element to the analyserNode
        sourceNode = audioCtx.createMediaElementSource(audioElement); 
        sourceNode.connect(analyserNode);

        analyserNode.connect(audioCtx.destination); //Connect the analyserNode to the speakers
        
        return analyserNode;
    }

    //Visualizer UI setup
    function visualizerUI()
    {
        document.querySelector("#trackSelect").onchange = function(e) //Change tracks
        {
            playStream(audioElement,e.target.value);
        };
        
        document.querySelector("#schemeSelect").onchange = function(e) //Change scheme
        {
            scheme = e.target.value;
        };
        
        
        //Checkboxes
        document.querySelector("#bars").onchange = function(e)
        {
            bars = e.target.checked;
        }
        document.querySelector("#lineform").onchange = function(e)
        {
            lineform = e.target.checked;
        }
        document.querySelector("#invert").onchange = function(e)
        {
            invert = e.target.checked;
        }
        document.querySelector("#noise").onchange = function(e)
        {
            noise = e.target.checked;
        }

        
        document.querySelector("#fsButton").onclick = function() //Go fullscreen
        {
            requestFullscreen(canvas);
        };
    }

    //Playing sound
    function playStream(audioElement,path)
    {
        audioElement.src = path;
        audioElement.play();
        audioElement.volume = 0.2;
        document.querySelector('#status').innerHTML = "Now playing: " + path;
    }

    function update()
    {
        canvas.width = document.body.clientWidth; //Dynamically adjust the size of the canvas
        audioElement.style.width = document.body.clientWidth + "px"; //Dynamically adjust the size of the controls
        requestAnimationFrame(update); //Update the animation frame 60 times a second
        var data = new Uint8Array(NUM_SAMPLES); //0-255, Nyquist theorem?
        //analyserNode.getByteFrequencyData(data); //Populate the arrays with frequency data
        analyserNode.getByteTimeDomainData(data); //Populate the arrays with waveform data

        ctx.clearRect(0, 0, canvas.width, canvas.height); //Clear the canvas
        var barWidth = 2;
        var barSpacing = 1;
        
        //Fade in/out on pause
        if (audioElement.paused)
        {
            fadeCount -= .017;
            
            if (fadeCount < 0)
                fadeCount = 0;
            
            ctx.globalAlpha = fadeCount;
        }
        else if (!audioElement.paused)
        {
            fadeCount += .017;
            
            if (fadeCount > 1)
                fadeCount = 1;
            
            ctx.globalAlpha = fadeCount;
        }
              
        if (ctx.globalAlpha > 0)
            for(var i = 0; i < data.length; i++) //Loop through the data to draw
            {
                //Scheme
                if (scheme == "lime")
                {
                    ctx.strokeStyle = "lime";
                    ctx.fillStyle = "lime";
                }
                else if (scheme == "tvTest")
                {
                    ctx.strokeStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1); 
                    ctx.fillStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), 1);
                }
                else if (scheme == "tvTestFade" && i < data.length / 2)
                {
                    ctx.strokeStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), i / 255); 
                    ctx.fillStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), i / 255);
                }
                else if (scheme == "tvTestFade" && i > data.length / 2)
                {
                    ctx.strokeStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.abs(i - 255) / 255); 
                    ctx.fillStyle = makeColor(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.abs(i - 255) / 255);
                }

                //Draw rectangles on the left and right of the screen
                if (bars)
                {
                    if (i % 2 == 0)
                    {
                        ctx.fillRect(0, i * (barWidth), (canvas.width / 4) - data[i], barWidth);
                    }
                    else
                    {
                        ctx.fillRect(canvas.width, (i - 1) * (barWidth), -(canvas.width / 4) + data[i], barWidth);
                    }
                }

                //Draw the lineform
                if (lineform)
                {
                    ctx.fillRect(i * (canvas.width / data.length), ((canvas.height / 2) + data.length - data[i]) - data[i], canvas.width / data.length, (data.length / 2) - data[i]);
                    //ctx.fillRect(x, y, w, h);
                }
            }

        manipulatePixels();
    }
    
    //For checkboxes that alter the look of the audio visualizer
    function manipulatePixels()
    {
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height); //getImageData object

        var data = imageData.data; //1024000 pixels
        var length = data.length;
        var width = imageData.width;

        //data[i] is the red value
        //data[i + 1] is the green value
        //data[i + 2] is the blue value
        //data[i + 3] is the alpha value
        for (var i = 0; i < length; i += 4)
        {
            //Invert all color channels
            if (invert)
            {
                var red = data[i], green = data[i + 1], blue = data[i + 2];
                data[i] = 255 - red; //Set red value
                data[i + 1] = 255 - green; //Set green value
                data[i + 2] = 255 - blue; //Set blue value
            }

            //Make noise
            if (noise && Math.random() < .01)
            {
                data[i] = data[i + 1] = data[1 + 2] = data[i + 3] = 255;
            }
        }

        ctx.putImageData(imageData, 0, 0); //Draw image data on the canvas
    }

    //String concatenation to make colors
    function makeColor(red, green, blue, alpha)
    {
        var color = "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
        return color;
    }

    //Make the audio visualizer fullscreen if it is supported
    function requestFullscreen(element)
    {
        if (element.requestFullscreen)
            element.requestFullscreen();
        else if (element.mozRequestFullscreen)
            element.mozRequestFullscreen();
        else if (element.mozRequestFullScreen) //Camel-cased 'S' was changed to 's' in spec
            element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen)
            element.webkitRequestFullscreen();
    }
    
    //Mouse interaction with the canvas
    function canvasInteraction()
    {
        //If the canvas is clicked on to pause
        document.querySelector("#canvas").onclick = function(e)
        {
            if (!audioElement.paused)
            {
                audioElement.pause();
            }
            else if(audioElement.paused)
            {
                audioElement.play();
            }
        };
        
        //Disables default behaviors allowing for drop
        canvas.ondragover = function (e)
        {
            e.preventDefault();
        };
        
        //Allows for audio to be dropped onto the canvas
        canvas.ondrop = function (e)
        {
            e.preventDefault(); //Stop the default behavior
            playStream(audioElement, URL.createObjectURL(e.dataTransfer.files[0]));
        }
    }
}());