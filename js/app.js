/*
 * Create a list that holds all of your cards
 */
let cards = ['diamond', 'diamond', 'paper-plane-o', 'paper-plane-o',
             'anchor', 'anchor', 'bolt', 'bolt',
             'leaf', 'leaf', 'bicycle', 'bicycle',
             'bomb', 'bomb', 'cube', 'cube'];

let openedCard = null;
let openedCnt = 0;

// Prevent another event while an event is ongoing
let inProcess = 0;

let deck = document.querySelector('.deck');

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
document.querySelector('.restart').addEventListener('click', function() {
  cards = shuffle(cards);

  deck.style.display = 'none';

  // create a string of list of shuffled cards
  deck.innerHTML = cards.map(x => '<li class=\"card\"><i class=\"fa fa-' + x + '\"></i></li>').join('');

  deck.style.display = 'flex';

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

    // flip the card
    displayCardSymbol(newCard);

    if (openedCard === null) {
      // assign to opened card
      openedCard = newCard;
      inProcess = 0;
    }
    else if (openedCard === newCard) {
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
      alert('Win!');
    }, 500);

  }
}

function cardsNotMatch(elem) {
  hideCardSymbol(openedCard);
  openedCard = null;
  hideCardSymbol(elem);
  inProcess = 0;
}
