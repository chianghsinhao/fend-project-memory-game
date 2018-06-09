/*
 * Create a list that holds all of your cards
 */
let cards = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o',
             'anchor', 'anchor', 'bolt', 'bolt',
             'leaf', 'leaf', 'bicycle', 'bicycle',
             'bomb', 'bomb', 'cube', 'cube'];

let openedCard = null;
let openedCnt = 0;
let moveCnt = 0;

// Prevent another event while an event is ongoing
let inProcess = 0;

let deck = document.querySelector('.deck');
let stars = document.getElementsByClassName('fa-star');
let move = document.querySelector('.moves');
let modal = document.getElementById('myModal');
let modalText = document.getElementById('modal-text');
let starRating = document.getElementById
let closeBtn = document.getElementsByClassName("close")[0];

// time counter in seconds
let tsec = 0;
let timeStart = false;
let timeElem = document.getElementById('time-text');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
document.querySelector('.restart').addEventListener('click', function() {
  cards = shuffle(cards);
  drawDeck();

  tsec = 0;
  timeStart = false;
  timeElem.textContent = 0;

  openedCnt = 0;
  openedCard = null;

  for (let i = 0; i < stars.length; ++i) {
    stars[i].style.display = 'inline-block';
  }

  moveCnt = 0;
  move.textContent = 0;
});

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function drawDeck() {
  deck.style.display = 'none';

  // create a string of list of shuffled cards
  deck.innerHTML = cards.map(x => '<li class=\"card\"><i class=\"fa fa-' + x + '\"></i></li>').join('');

  deck.style.display = 'flex';
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
deck.addEventListener('click', function(evt) {
  let newCard = evt.target;
  if (evt.target.nodeName === 'I') {
    newCard = newCard.parentElement;
  }
  // a card not matched yet
  if (newCard.classList.contains('card') &&
      (!newCard.classList.contains('match'))) {

    if (inProcess) {
      return;
    }

    inProcess = 1;

    if (!timeStart) {
      setTimeout(timeCounter, 1000);
      timeStart = true;
    }

    // flip the card
    displayCardSymbol(newCard);

    if (openedCard === null) {
      // assign to opened card
      openedCard = newCard;
      inProcess = 0;
    }
    else {
      moveCnt++;
      move.textContent = moveCnt;

      if (openedCard === newCard) {
        // flip back the 1st card
        hideCardSymbol(newCard);
        openedCard = null;
        inProcess = 0;
      }
      else {
        // check if the opened card match
        let classList1 = openedCard.firstElementChild.classList;
        let classList2 = newCard.firstElementChild.classList;
        if (classList1.value === classList2.value) {
          cardsMatch(newCard);
          inProcess = 0;
        }
        else {
          hideCardSymbol(openedCard);
          hideCardSymbol(newCard);
          mismatchCardSymbol(openedCard);
          mismatchCardSymbol(newCard);
          setTimeout(function() {
            cardsNotMatch(newCard);
          }, 1000);
        }
      }
    }
  }
});

function displayCardSymbol(elem) {
  elem.classList.add('show', 'open');
}

function hideCardSymbol(elem) {
  elem.classList.remove('show', 'open', 'mismatch');
}

function mismatchCardSymbol(elem) {
  elem.classList.remove('open');
  elem.classList.add('mismatch');
}

function cardsMatch(elem) {
  openedCard.classList.toggle('match');
  elem.classList.toggle('match');
  openedCard = null;

  openedCnt += 2;
  if (openedCnt === cards.length) {
    setTimeout(function(){
      modal.style.display = "block";
      modalText.textContent = 'Great job! You took ' + moveCnt + ' moves in ' + tsec + ' seconds!';
    }, 500);
  }
}

function cardsNotMatch(elem) {
  hideCardSymbol(openedCard);
  openedCard = null;
  hideCardSymbol(elem);
  inProcess = 0;
}

// callback for timer event; increment time by one second before game ends;
// and setup next event
function timeCounter() {
  timeElem.textContent = tsec;
  tsec++;

  if (tsec > 30) {
    stars[0].style.display = 'none';
  }
  else if (tsec > 20) {
    stars[1].style.display = 'none';
  }
  else if (tsec > 10) {
    stars[2].style.display = 'none';
  }

  if (timeStart && (openedCnt < cards.length)) {
    setTimeout(timeCounter, 1000);
  }
}

closeBtn.addEventListener('click', function(){
  modal.style.display = 'none';
});

window.addEventListener('click', function(event){
  if (event.target == modal) {
    modal.style.display = 'none';
  }
});

// shuffle on document ready
cards = shuffle(cards);
drawDeck();

