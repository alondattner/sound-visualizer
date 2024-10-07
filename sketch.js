/**   _________                        ._______   ____.__                    .__  .__                     
 *   /   _____/ ____  __ __  ____    __| _/\   \ /   /|__| ________ _______  |  | |__|_______ ___________ 
 *   \_____  \ /  _ \|  |  \/    \  / __ |  \   Y   / |  |/  ___/  |  \__  \ |  | |  \___   // __ \_  __ \
 *   /        (  <_> )  |  /   |  \/ /_/ |   \     /  |  |\___ \|  |  // __ \|  |_|  |/    /\  ___/|  | \/
 *  /_______  /\____/|____/|___|  /\____ |    \___/   |__/____  >____/(____  /____/__/_____ \\___  >__|    by Alon Dattner
 *          \/                  \/      \/                    \/           \/              \/    \/       
 *  
 *  SoundVisualizer is a dynamic and audio-reactive 3D sound/music visualizer
 *  WARNING: This script may potentially trigger seizures for people with photosensitive epilepsy. Viewer discretion is advised.
 *    
 *  - Press 'f' to toggle [f]ullscreen
 *  - Press 'p' to [p]ause music
 *  - Use mouse wheel to control volume (the animation is reactive to the volume)
 *
 **/

// Initialize the speed how fast the shape changes (you can try values between 0 and 1)
let shapeChangeSpeed = 0.5;

// DON'T TOUCH THIS!
let shapeStep;
let song;
let fft;

/**
 *  Preload the song
 **/
function preload() {
    song = loadSound('ES-The-Yawn-Ballpoint (2).mp3');
}

/**
 *  Setup scene
 **/
function setup() {
  
  // General setup
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  noFill();
  
  // Make animation different every time
  shapeStep = random(10,300);
  
  // Start song and get fft for waveform
  song.loop();
  fft = new p5.FFT();
}

/**
 *  Draw scene
 **/
function draw() {
  
  // Get current average amplitude (volume)
  let currentAverageAmplitude = getCurrentAverageAmplitude();
 
  // Set background based on amplitude (flicker effect)
  if(currentAverageAmplitude > 0.1) {
    background(50);
  } else {    
    background(10);
  }
  
  // Rotate scene
  rotateX(frameCount / 10);
  rotateY(frameCount / 10);
  
  // Calculate height factor (for responsiveness)
  let heightFactor = map(windowHeight, 0, 2000, 1, 15);
  
  // Draw shape
  for (var i = 0; i < 40; i++) {
    
    // Calculate and set section color
    var r = map(sin(frameCount / 2), -1, 1, 0, 255);
    var g = map(i, 0, 50, 0, 255);
    var b = map(cos(frameCount / 2), -1, 1, 0, 255);
    stroke(r, g, b);

    // Rotate section
    rotate(frameCount / 20);

    // Draw section shape
    beginShape();
    for (var j = 0; j < 360; j += shapeStep) {
      var radius = i * heightFactor;
      var x = radius * cos(j);
      var y = radius * sin(j);
      var z = sin(frameCount * 2 + i * 5) * max(20, currentAverageAmplitude * 1500);
      vertex(x, y, z);
    }
    endShape(CLOSE);
    
    // Reverse speed if needed
    if(shapeStep >= 359 || shapeStep < 10) {
      shapeChangeSpeed = -shapeChangeSpeed; 
    }
    
    // Increase shapeStep
    shapeStep += (shapeChangeSpeed / 100);
  }
}

/**
 *  Returns the current average amplitute (volume)
 **/
function getCurrentAverageAmplitude() { 
  
  // Get waveform
  let wave = fft.waveform();
  
  // Add each point of waveform to sum
  let sum = 0;
  for(let i=0; i<wave.length; i++) {
    sum += wave[i];
  }
  
  // Return average
  return abs(sum/wave.length);
}

/**
 *  Handles user input
 **/
function keyPressed() {
  switch(key) {
      
    // Toggle fullscreen
    case 'f': {
      fullscreen(!fullscreen())
      break;
    }
      
    // Toggle music
    case 'p': {
      if(song.isPlaying()) {
        song.pause();
      } else {
        song.loop();
      }
      break;
    }
  }
}

/**
 *  Handles volume control
 **/
function mouseWheel(event) {
  
  // Get current volume
  let volume = song.getVolume();
  
  // Adjust volume based on mouse wheel
  volume -= event.delta * 0.001;
  volume = constrain(volume, 0, 1);
  song.setVolume(volume);
}

/**
 *  Handles responsiveness
 **/
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}