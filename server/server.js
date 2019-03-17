const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const PORT = 5000;

let roundArray = [];

// This must be added before GET & POST routes.
app.use(bodyParser.urlencoded({extended:true}))

// Serve up static files (HTML, CSS, Client JS)
app.use(express.static('server/public'));

// GET & POST Routes go here


app.listen(PORT, () => {
  console.log ('Server is running on port', PORT)
})

app.post('/guess', function(req, res) {
  
  let guess = req.body;
  console.log('Adding Guesses', guess);
  roundArray = [];
  checkGuesses('Player One', guess.playerOne);
  checkGuesses('Player Two', guess.playerTwo);
  checkGuesses('Player Three', guess.playerThree);
  res.sendStatus(201);
})

function randomNumberGen(minValue, maxValue){
  let randomNumber = (Math.random() * (maxValue - minValue) + minValue);
  return Math.round(randomNumber);
}

class playerData{
  constructor(name, guess, win, highLow){
    this.name=name;
    this.guess=guess;
    this.win=win;
    this.highLow=highLow;
  }
}

let randomNumber = randomNumberGen(1,25);
// check to make sure randomNumber calculates correctly
console.log('random number: ',randomNumber);


function checkGuesses(playerName, guess){
  let win = false;
  let highLow = '';
  if (guess > randomNumber){
    highLow = 'Too High!';
  }
  else if (guess < randomNumber){
    highLow = 'Too Low!';
  }
  else{
    win=true;
  }
  let player= new playerData(playerName, guess, win, highLow);
  roundArray.push(player);
}

app.get('/guess', function(req,res){
  console.log('in send guess', roundArray);
  res.send(roundArray);
})


app.post('/restart', function(req, res) {
  console.log('in post restart');
  randomArray = [];
  console.log(randomArray);
  randomNumber = randomNumberGen(1, 25);
  console.log(randomNumber);
  res.sendStatus(201);
})