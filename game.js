var gameOverBoolean = true;
var correctSequence, userSequence;
var positionInSequence;
var stillCorrect;
var buttonColors = ["green", "red", "yellow", "blue"];

function getNextColor() {
  var nextColor = Math.floor(Math.random() * 4);
  console.log("next color is " + nextColor);
  correctSequence.push(buttonColors[nextColor]);

  console.log("correctSequence of colors " + correctSequence);
}

function playSound(sound) {
  new Audio('sounds/' + sound + '.mp3').play();
}

function animatePress(color) {
  $("#" + color).addClass("pressed");
  setTimeout(function() {
    $("#" + color).removeClass("pressed");
  }, 300); // 300 mm delay until remove "pressed" class
}

function showAnswer() {
  var i = 0;
  var moves = setInterval(function() {
    animatePress(correctSequence[i]);
    playSound(correctSequence[i]);
    i++;
    if (i >= correctSequence.length) {
      clearInterval(moves);
    }
  }, 600);
}

function createNextLevel() {
  level++;
  $("#level-title").text("Level " + level);
  getNextColor();
  stillCorrect = true;
  userSequence = [];
  positionInSequence = 0;
  showAnswer();
}

function initialize() {
  //alert("initilizing");
  if (gameOverBoolean === true) {
    //alert("starting");
    gameOverBoolean = false;
    level = 0;
    correctSequence = [];
    // generate first level
    createNextLevel();
    allowButtonClicks();


  } else { // restarting game
    //alert("ending");
    gameOverBoolean = true;
  }

}

//when game is over, do not track button clicks until a key is pressed
function gameOver() {
  gameOverBoolean = true;
  preventButtonClicks();
  $("#level-title").text("Game Over, Press Any Key to Restart");
  playSound("wrong");
  $("body").addClass("game-over");
  setTimeout(function() {
    $("body").removeClass("game-over");
  }, 200);
}

function trackUserClicks(color) {
  userSequence.push(color);
  animatePress(color);
  console.log("correct sequence " + correctSequence[userSequence.length - 1]);
  //console.log("user " + userSequence[userSequence.length-1]);
  if (correctSequence[positionInSequence] === userSequence[positionInSequence]) {
    // correct
    if (positionInSequence < correctSequence.length - 1) { // hasn't finished the sequence
      playSound(color);
      positionInSequence++;
    } else { // move on to next level
      playSound(color);
      setTimeout(function() {
        createNextLevel();
      }, 1000);
    }
  } else { // wrong answer, game over
    gameOver();
  }

}

function allowButtonClicks() {
  // register button clicks
  $(".btn").on("click", function() {
    console.log("attribs = " + this.id);
    trackUserClicks(this.id);
  });
}

function preventButtonClicks() {
  $(".btn").off("click");
  //alert("preventing clicks");
}

// wait for a keypress to initialize game
$(document).keydown(initialize);
// auto initialize if running on device where keypress is not available
if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  initialize();
 }

