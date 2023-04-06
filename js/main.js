document.querySelector('#dealTwoCards').addEventListener('click', drawTwo)

//get deck id, store in localStorage
function getDeck() {
  if (!localStorage.getItem('deckId')) {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let deckId = data.deck_id
        localStorage.setItem('deckId', deckId)
      })
      .catch(err => {
        console.log(`error ${err}`)
      });
  }
}
getDeck()

if (!localStorage.getItem('runningScoreP1')) {
  localStorage.setItem('runningScoreP1', 0)
}
if (!localStorage.getItem('runningScoreP2')) {
  localStorage.setItem('runningScoreP2', 0)
}


//draw two cards, play the game
function drawTwo(){
  const url = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckId')}/draw/?count=2`
  const player1Card = document.querySelector('#player1Card')
  const player2Card = document.querySelector('#player2Card')
  const resultDisplay = document.querySelector('#resultDisplay')
  let runningScoreP1 = Number(localStorage.getItem('runningScoreP1'))
  let runningScoreP2 = Number(localStorage.getItem('runningScoreP2'))

  fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      
      p1WarBoard.innerHTML = ''
      p2WarBoard.innerHTML = ''

      if (runningScoreP1 + runningScoreP2 == 52) {
        resultDisplay.innerHTML = 'No cards remaining!'
      } else if (data.error?.includes('Not enough cards remaining')) {
        resultDisplay.innerHTML = 'Not enough cards remaining!'
      }
      
      else {
        console.log(data)

        player1Card.src = data.cards[0].image
        player2Card.src = data.cards[1].image
  
        let player1Val = convertToNum(data.cards[0].value)
        let player2Val = convertToNum(data.cards[1].value)
  
        console.log(runningScoreP1, runningScoreP2)
        let runningScoreP1Display = document.querySelector('#runningScoreP1')
        let runningScoreP2Display = document.querySelector('#runningScoreP2')
  
        if (player1Val > player2Val) {
          resultDisplay.innerHTML = 'Player 1 wins!'
          runningScoreP1 = Number(runningScoreP1 + 2)
          localStorage.setItem('runningScoreP1', runningScoreP1)
          runningScoreP1Display.innerHTML = runningScoreP1
        } else if (player1Val < player2Val) {
          resultDisplay.innerHTML = 'Player 2 wins!'
          runningScoreP2 = Number(runningScoreP2 + 2)
          localStorage.setItem('runningScoreP2', runningScoreP2)
          runningScoreP2Display.innerHTML = runningScoreP2
        } else {
          resultDisplay.innerHTML = 'WAR!'
          war()
        }  
      }
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

function convertToNum(val) {
  switch(val) {
    case 'JACK':
      return 11
      break
    case 'QUEEN':
      return 12
      break
    case 'KING':
      return 13
      break
    case 'ACE':
      return 14
      break
    default:
      return Number(val)
  }
}

//war!
function war() {
  const urlWar = `https://deckofcardsapi.com/api/deck/${localStorage.getItem('deckId')}/draw/?count=8`
  fetch(urlWar)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
      console.log(data)

      const p1WarBoard = document.querySelector('#p1WarBoard')
      const p2WarBoard = document.querySelector('#p2WarBoard')

      p1WarBoard.innerHTML = ''
      p2WarBoard.innerHTML = ''

      p1WarBoard.innerHTML = `
      <img src="${data.cards[0].image}">
      <img src="${data.cards[1].image}">
      <img src="${data.cards[2].image}">
      `
      p2WarBoard.innerHTML = `
      <img src="${data.cards[3].image}">
      <img src="${data.cards[4].image}">
      <img src="${data.cards[5].image}">
      `

      let player1WarCard = convertToNum(data.cards[6].value)
      let player2WarCard = convertToNum(data.cards[7].value)

      p1WarBoard.innerHTML += `<img src="${data.cards[6].image}" class="warCard">`
      p2WarBoard.innerHTML += `<img src="${data.cards[7].image}" class="warCard">`

      let runningScoreP1Display = document.querySelector('#runningScoreP1')
      let runningScoreP2Display = document.querySelector('#runningScoreP2')
      let runningScoreP1 = Number(localStorage.getItem('runningScoreP1'))
      let runningScoreP2 = Number(localStorage.getItem('runningScoreP2'))

      console.log(runningScoreP1, runningScoreP2)

      if (player1WarCard > player2WarCard) {
        resultDisplay.innerHTML = 'Player 1 wins!'
        runningScoreP1 = Number(runningScoreP1 + 8)
        localStorage.setItem('runningScoreP1', runningScoreP1)
        runningScoreP1Display.innerHTML = runningScoreP1
      } else if (player1WarCard < player2WarCard) {
        resultDisplay.innerHTML = 'Player 2 wins!'
        runningScoreP2 = Number(runningScoreP2 + 8)
        localStorage.setItem('runningScoreP2', runningScoreP2)
        runningScoreP2Display.innerHTML = runningScoreP2
      } else {
        resultDisplay.innerHTML = 'WAR!'
        war()
      }

    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

//start new game
document.querySelector('#startNewGame').addEventListener('click', startNew)

function startNew() {
  document.querySelector('#p1WarBoard').innerHTML = ''
  document.querySelector('#p2WarBoard').innerHTML = ''
  document.querySelector('#runningScoreP1').innerHTML = ''
  document.querySelector('#runningScoreP2').innerHTML = ''
  document.querySelector('#player1Card').src = 'assets/card-placeholder.png'
  document.querySelector('#player2Card').src = 'assets/card-placeholder.png'
  document.querySelector('#resultDisplay').innerHTML = 'New game started.'
  localStorage.clear()
  getDeck()
}

//https://deckofcardsapi.com/