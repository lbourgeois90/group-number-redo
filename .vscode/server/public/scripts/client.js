$(document).ready(handleReady);

//create counter that will later be appended to count round as well as div
let counter = 0;
let playerOneGuesses = [];
let playerTwoGuesses = [];
let playerThreeGuesses = [];


//load jquery
function handleReady() {
  console.log("jquery is loaded!")
  //create submit button that will prevent reload, run input guesses and each time 
  //button is click increase counter 
  $('#submit-button').on('click', function(event) {
    event.preventDefault();
    inputGuesses();
    counter++;
  })
  //create a giantrestart button that will run the restart function-- is not appended to 
  //dom automatically- comes into DOM on winDom function
$('#roundInfo').on('click', '#giantRestart', restart);
}

//function that pull values from DOM inputs-- create a object that store values for
//player guesses--
//calls postGuesses function with input of guessData

function inputGuesses() {
  console.log('Hello');
  let playerOneInput = $('#player-1').val();
  let playerTwoInput = $('#player-2').val();
  let playerThreeInput = $('#player-3').val();
  if (playerOneInput < 0 || playerTwoInput < 0 || playerThreeInput < 0 ){
    clearInputData();
   return alert(`Please guess a number between 0 and 24!`);
  }
  if (playerOneInput > 24 || playerTwoInput > 24 || playerThreeInput > 24 ){
    clearInputData();
   return alert(`Please guess a number between 0 and 24!`);
  }
  if (playerOneInput === '' || playerTwoInput === '' || playerThreeInput === '' ){
    clearInputData();
    return alert(`Please guess a number between 0 and 24!`);
  }
  let roundGuesses ={
    playerOne: playerOneInput,
    playerTwo: playerTwoInput,
    playerThree: playerThreeInput,
  }
  postGuesses(roundGuesses);
  clearInputData();
}

function clearInputData(){
  $('#player-1').val('');
  $('#player-2').val('');
  $('#player-3').val('');
}

//function that posts(sends) object that conbtains player input (which is created in
//guess data)-- data gets posted to server, stored in /guess URL, then runs the 
//getRound function-- has catch alert for errors on post to server
function postGuesses(guessData) {
  $.ajax({
    method: 'POST',
    url: '/guess',
    data: guessData
  }).then(function(reponse) {
    getRound();
  }).catch(function(error) {
    console.log('Error adding player guesses');
    alert('Sorry! Could not submit guesses');
  })
}

//function that "gets" the roundArray from the server that is stored in an array located 
// on the /guess URL. Then once that data is got, runs render function to append data
//to DOM. Once data is appended to DOM, runs function winDOM-- has catch for error alert
function getRound(){
$.ajax({
  method: 'GET',
  url: '/guess'
})
.then(function(response) {
  console.log('Server response for round', response);
  allGuesses(response);
  render(response);
  winDOM(response);
}).catch(function(error) {
  console.log('Error with round response');
  alert('Sorry! Could not receive round responses!');
})
}

//function that appends data from getRound function (getting data from server)--
//loops through array and appends that data to the dom 
// function render(response) {
//   let playerOneResponse = playerOneResponse +

//  $('#results').append(`<div id="round-div${counter}">
//  <h2>Round: ${counter}</h2>
//  </div>`);
// for (let i = 0; i < response.length; i++) {
//   $(`#round-div${counter}`).append(`
//     <p>${response[i].name}</p>
//     <p>Guess: ${response[i].guess}</p>
//     <p>High or Low: ${response[i].highLow}</p>
//     `);
//   }
// }

function render(response) {
  $('#roundInfo').empty();

  $('#roundInfo').append(`<h2 id="round">Round: ${counter}</h2>`)
  $('#roundInfo').append(`
  <p>Player One Guess Is: ${response[0].highLow}</p>
  <p>Player Two Guess Is: ${response[1].highLow}</p>
  <p>Player Three Guess Is: ${response[2].highLow}</p>
  `)

  $('#tableBody').append(`<tr>
  <td>${response[0].guess}</td>
  <td>${response[1].guess}</td>
  <td>${response[2].guess}</td>
  </tr>`);


  }

//function that creates winner variable and runs for loop to determine if object sent from
//server has a key that has a .win property that is set to true-- if condition runs 
//with .win ==true then winner variable takes value of player that has won (value taken)
//from roundArray
function winDOM(response) {
  console.log('In winDom');
  let winner = '';
  let emptyCondition = false;
  for (let i = 0; i<response.length; i++){
    if(response[i].win === true){
      winner = winner + (response[i].name) + " ";
      emptyCondition = true;
    }
  }
  if (emptyCondition === true){
    alert(winner + 'you won!!!')
    counter = 0;
    $('#roundInfo').empty();
    $('#tableBody').empty();
    $('#roundInfo').append(`<button id="giantRestart">RESTART</button>`);
  }
  //console.log('in winDOM', response);
  winner = '';
}

function restart(){
  console.log('in restart button');
  playerOneGuesses = [];
  playerTwoGuesses = [];
  playerThreeGuesses = [];
$.ajax({
  method: 'POST',
  url: '/restart',
}).then(function(response){
  $('#roundInfo').empty();
}).catch(function(error){
  console.log("Error restarting game");
  alert('Error restarting game! Sorry!');
})
}

function allGuesses(response) {
  (console.log('in allGuesses'));
  
  for ( let i = 0; i<response.length; i++){
    if (response[i].name === 'Player One'){
     let player = { 
        guess: response[i].guess,
        highLow: response[i].highLow
      }
      playerOneGuesses.push(player);
      console.log(playerOneGuesses);
    }
    if (response[i].name === 'Player Two'){
      let player = { 
        guess: response[i].guess,
        highLow: response[i].highLow
      }
      playerTwoGuesses.push(player);
      console.log(playerTwoGuesses);
    }
    if (response[i].name === 'Player Three'){
      let player = { 
        guess: response[i].guess,
        highLow: response[i].highLow
      }
      playerThreeGuesses.push(player);
      console.log(playerThreeGuesses);
    }
  }
}