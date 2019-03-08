import generatePlayers, { players } from "./generate.js";
// import clearTable, { resetGame } from "./resets.js";
import newDeck, { shuffle } from "./cardDeck.js";
import assignCardsToPlayers, { dealtDeck } from "./cardHands.js";
import buy, { hold } from "./buyHold.js";

// ///// VARIABLES /////////////////////////////////////////////
export const v = { numPlayers: null, numCards: 12, activePlayerNum: 1 }; // defaults
// export const players = [];
export const playerText1 = document.querySelector(".dealerP1");

// Control and Players variables
const beginEndGameButton = document.querySelector(".beginEndGameButton");
const playersButton = document.querySelector(".playersButton");
const dealButton = document.querySelector(".dealButton");
const num1to4 = document.querySelector(".num1to4");
// const players = [];
// let numPlayers;
// let activePlayerNum = 1; // default 1
// let numCards = 12; // default 12
let eventsCards;
// let dealtDeck;
// Hand variables
const exchangeButton = document.querySelector(".exchangeButton");
const buyButton = document.querySelector(".buyButton");
const holdButton = document.querySelector(".holdButton");
const playerOneArea = document.querySelector(".playerOneArea");
const playerTwoArea = document.querySelector(".playerTwoArea");
const playerThreeArea = document.querySelector(".playerThreeArea");
const playerFourArea = document.querySelector(".playerFourArea");
export const extraHand = [];
export const dealerHand = [];
export const leftOfDealerHand = [];
export const acrossFromDealerHand = [];
export const rightOfDealerHand = [];
export const allHands = [];

// Card variables
export const aCard = document.querySelectorAll(".aCard");
const extraCard = document.querySelectorAll(".extraCard");
const playerOneCard = document.querySelectorAll(".playerOneCard");
const playerTwoCard = document.querySelectorAll(".playerTwoCard");
const playerThreeCard = document.querySelectorAll(".playerThreeCard");
const playerFourCard = document.querySelectorAll(".playerFourCard");
let activeCards = playerOneCard; // default playerOneCard
// const playerText1 = document.querySelector(".dealerP1");
const playerText2 = document.querySelector(".dealerP2");
const playerText3 = document.querySelector(".dealerP3");
const playerText4 = document.querySelector(".dealerP4");
// export const cardsToExtraHand = [];
const cardsToExtraHand = [];
// export const cardsFromExtraHand = [];
const cardsFromExtraHand = [];
// Game/round active and reset variables
let activeGame = false;
let activeRound = false;
let changeActivePlayer;

// // ///// RESET GAME/ROUND FUNCTIONS ////////////////////////////

export const clearTable = () => {
  activeRound = false;
  dealtDeck.length = 0;
  extraHand.length = 0;
  dealerHand.length = 0;
  leftOfDealerHand.length = 0;
  acrossFromDealerHand.length = 0;
  rightOfDealerHand.length = 0;
  allHands.length = 0;
  cardsToExtraHand.length = 0;
  cardsFromExtraHand.length = 0;
  aCard.forEach(card => {
    card.classList.remove("is-active");
    card.textContent = "";
  });
};

const resetGame = () => {
  clearTable();
  eventsCards();
  activeGame = false;
  players.length = 0;
  v.activePlayerNum = 1;
  activeCards = playerOneCard;
  dealButton.textContent = "Players?";
  beginEndGameButton.textContent = "Start";
  num1to4.textContent = 3;
  v.numCards = 12;
};

// ///// GAME MANAGEMENT FUNCTIONS ///////////////////////////////

// Change number of players and number of cards to deal
const changePlayersNum = () => {
  if (!activeGame) {
    num1to4.textContent === "4"
      ? ((num1to4.textContent = "3"), (v.numCards = 12))
      : num1to4.textContent === "3"
      ? ((num1to4.textContent = "2"), (v.numCards = 9))
      : ((num1to4.textContent = "4"), (v.numCards = 15));
  }
};
playersButton.addEventListener("click", changePlayersNum);

// Generate players

// Begin play

const beginEndGame = () => {
  if (!activeGame) {
    activeGame = true;
    v.numPlayers = Number(num1to4.textContent);
    generatePlayers();
    playersButton.textContent = "Deal";
    beginEndGameButton.textContent = "End Game";
  } else if (activeGame && beginEndGameButton.textContent === "End Game") {
    beginEndGameButton.textContent = "Sure?";
  } else {
    resetGame();
  }
};
beginEndGameButton.addEventListener("click", beginEndGame);

const changeDealer = () => {
  // Check numPlayers and use players[index] to update position properties
  if (v.numPlayers === 4) {
    let player4position = players[3].position;
    players[3].position = players[2].position;
    players[2].position = players[1].position;
    players[1].position = players[0].position;
    players[0].position = player4position;
    let holdText = playerText4.textContent;
    playerText4.textContent = playerText3.textContent;
    playerText3.textContent = playerText2.textContent;
    playerText2.textContent = playerText1.textContent;
    playerText1.textContent = holdText;
  } else if (v.numPlayers === 3) {
    let player3position = players[2].position;
    players[2].position = players[1].position;
    players[1].position = players[0].position;
    players[0].position = player3position;
    let holdText = playerText3.textContent;
    playerText3.textContent = playerText2.textContent;
    playerText2.textContent = playerText1.textContent;
    playerText1.textContent = holdText;
  } else if (v.numPlayers === 2) {
    let player2position = players[1].position;
    players[1].position = players[0].position;
    players[0].position = player2position;
    let holdText = playerText2.textContent;
    playerText2.textContent = playerText1.textContent;
    playerText1.textContent = holdText;
  }
  // Find the new "dealer" and set the property .activePlayer: true
  // ...set non-dealers' property .activePlayer: false
  // Set activePlayerNum to the "dealer"'s player number
  players.forEach(player => {
    player.position === "dealer"
      ? ((player.activePlayer = true), (v.activePlayerNum = player.player))
      : (player.activePlayer = false);
    player.buyLastTurn = false;
    player.holdLastTurn = false;
  });
  // Remove active-area from each classlist
  playerOneArea.classList.remove("active-area");
  playerTwoArea.classList.remove("active-area");
  playerThreeArea.classList.remove("active-area");
  playerFourArea.classList.remove("active-area");
};

// End the round
const endRound = (msgSchnautzFeuer, num31Or33) => {
  let message = ``;
  let messageScores = ``;
  let messageTokens = ``;
  let lowScore = 33;

  // Check which player has the lowest score and build scores message
  players.forEach(player => {
    lowScore = player.currentScore <= lowScore ? player.currentScore : lowScore;
    messageScores += `Player ${player.player} score: ${player.currentScore}
    `;
  });

  players.forEach(player => {
    if (player.currentScore === lowScore) {
      player.tokens -= 1;
      messageTokens += `Player ${player.player} loses a token
      `;
    }
  });
  // If 31 (Schnautz) or 33 (Feuer) points, update message
  if (num31Or33)
    message = `${msgSchnautzFeuer}!!!
  `;
  // Build the message
  message += `
    ${messageScores}
    ${messageTokens}
    `;
  alert(message);

  // Reset properties in players array of objects
  players.forEach(player => {
    player.currentScore = null;
    player.buyLastTurn = false;
    player.holdLastTurn = false;
  });
  clearTable();
  changeDealer();
  playersButton.textContent = "Deal";
  beginEndGameButton.textContent = "End Game";
};

// Update player scores and check for 31 (Schnautz) or 33 (Feuer)
export const updateScore = playerNum => {
  let idxPlayers = playerNum - 1; // Convert player number to zero-based index
  let idxAllHands; // Set using players[idxPlayers].position property
  // Note: allHands[0] is extraHand, allHands[1] is dealerHand, etc
  players[idxPlayers].position === "dealer"
    ? (idxAllHands = 1)
    : players[idxPlayers].position === "leftOfDealer"
    ? (idxAllHands = 2)
    : players[idxPlayers].position === "acrossFromDealer"
    ? (idxAllHands = 3)
    : (idxAllHands = 4);

  // .points property stores point value of A(11),K(10),Q(10),J(10),10,9,8,7

  // If all three cards are the same suit, add the points
  allHands[idxAllHands][0].suit === allHands[idxAllHands][1].suit &&
  allHands[idxAllHands][0].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points +
        allHands[idxAllHands][1].points +
        allHands[idxAllHands][2].points)
    : // If two cards are the same suit, add the points
    allHands[idxAllHands][0].suit === allHands[idxAllHands][1].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points + allHands[idxAllHands][1].points)
    : allHands[idxAllHands][0].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points + allHands[idxAllHands][2].points)
    : allHands[idxAllHands][1].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][1].points + allHands[idxAllHands][2].points)
    : // If all three cards are aces, the score is 33
    allHands[idxAllHands][0].rank === "A" &&
      allHands[idxAllHands][1].rank === "A" &&
      allHands[idxAllHands][2].rank === "A"
    ? (players[idxPlayers].currentScore = 33)
    : // If all three cards are tens, the score is 30
    allHands[idxAllHands][0].rank === "10" &&
      allHands[idxAllHands][1].rank === "10" &&
      allHands[idxAllHands][2].rank === "10"
    ? (players[idxPlayers].currentScore = 30)
    : // If all three cards are the same rank, the score is 30.5
    allHands[idxAllHands][0].rank === allHands[idxAllHands][1].rank &&
      allHands[idxAllHands][0].rank === allHands[idxAllHands][2].rank
    ? (players[idxPlayers].currentScore = 30.5)
    : // Otherwise, the score is the point value of the highest card
    allHands[idxAllHands][0].points >= allHands[idxAllHands][1].points &&
      allHands[idxAllHands][0].points >= allHands[idxAllHands][2].points
    ? (players[idxPlayers].currentScore = allHands[idxAllHands][0].points)
    : allHands[idxAllHands][0].points >= allHands[idxAllHands][1].points &&
      allHands[idxAllHands][0].points <= allHands[idxAllHands][2].points
    ? (players[idxPlayers].currentScore = allHands[idxAllHands][2].points)
    : allHands[idxAllHands][0].points <= allHands[idxAllHands][1].points &&
      allHands[idxAllHands][1].points >= allHands[idxAllHands][2].points
    ? (players[idxPlayers].currentScore = allHands[idxAllHands][1].points)
    : (players[idxPlayers].currentScore = allHands[idxPlayers][2].points);
  console.log(
    `Player ${players[idxPlayers].player} score: ${
      players[idxPlayers].currentScore
    }`
  );
};

// ///// CARD AND DECK FUNCTIONS ////////////////////////////////
// Moved deck functions to cardDeck.js

// Style black cards
const styleBlackCards = () => {
  aCard.forEach(card =>
    card.textContent.includes("♤")
      ? card.classList.add("aCardBlack")
      : card.textContent.includes("♧")
      ? card.classList.add("aCardBlack")
      : card.classList.remove("aCardBlack")
  );
};

// Manage cards that current player will be exchange with extra hand
const manageCardsToExchange = (fromExtra, isSelected, cardObj) => {
  fromExtra && isSelected
    ? cardsFromExtraHand.push(cardObj)
    : fromExtra && !isSelected
    ? cardsFromExtraHand.splice(cardsFromExtraHand.indexOf(cardObj), 1)
    : !fromExtra && isSelected
    ? cardsToExtraHand.push(cardObj)
    : cardsToExtraHand.splice(cardsToExtraHand.indexOf(cardObj), 1);
};

// Select and deselect cards in active player's and extra hands
const selectDeselectCard = e => {
  // Note: mutates the objects that newDeck() created inside an array
  dealtDeck.forEach(cardObj => {
    // Toggles boolean "selected" property in card objects
    // Toggles event target's classList "is-active" for styling
    // Calls manageCardsToExchange with params (fromExtra, isSelected, cardObj)
    if (
      e.target.className.includes("extraCard") &&
      e.target.textContent === cardObj.card
    ) {
      cardObj.selected === false
        ? ((cardObj.selected = true),
          e.target.classList.add("is-active"),
          manageCardsToExchange(true, true, cardObj))
        : ((cardObj.selected = false),
          e.target.classList.remove("is-active"),
          manageCardsToExchange(true, false, cardObj));
    } else if (e.target.textContent === cardObj.card) {
      cardObj.selected === false
        ? ((cardObj.selected = true),
          e.target.classList.add("is-active"),
          manageCardsToExchange(false, true, cardObj))
        : ((cardObj.selected = false),
          e.target.classList.remove("is-active"),
          manageCardsToExchange(false, false, cardObj));
    }
  });
};
// Add event listeners to playerOneCard, etc., & extraCard NodeLists
extraCard.forEach(card => card.addEventListener("click", selectDeselectCard));
eventsCards = () => {
  activeCards.forEach(card =>
    card.addEventListener("click", selectDeselectCard)
  );
};

// Change the active player
changeActivePlayer = () => {
  let idx = v.activePlayerNum - 1; // Convert player number to zero-based index

  // Remove event listener for the current player's three cards
  activeCards.forEach(card =>
    card.removeEventListener("click", selectDeselectCard)
  );
  // Update players array of player objects -- player one is players[0], etc
  // Update player areas in DOM
  // Add event listeners to the next player's three cards
  v.activePlayerNum === 1
    ? // player two (players[1]) always follows player one (players[0])
      ((v.activePlayerNum = 2),
      (players[0].activePlayer = false),
      (players[1].activePlayer = true),
      playerOneArea.classList.remove("active-area"),
      playerTwoArea.classList.add("active-area"),
      (activeCards = playerTwoCard),
      eventsCards())
    : v.activePlayerNum === 2 && v.numCards === 9
    ? // 2 players: player one (players[0]) follows player two (players[1])
      ((v.activePlayerNum = 1),
      (players[1].activePlayer = false),
      (players[0].activePlayer = true),
      playerTwoArea.classList.remove("active-area"),
      playerOneArea.classList.add("active-area"),
      (activeCards = playerOneCard),
      eventsCards())
    : v.activePlayerNum === 2
    ? // 3/4 players: player three (players[2]) follows player two (players[1])
      ((v.activePlayerNum = 3),
      (players[1].activePlayer = false),
      (players[2].activePlayer = true),
      playerTwoArea.classList.remove("active-area"),
      playerThreeArea.classList.add("active-area"),
      (activeCards = playerThreeCard),
      eventsCards())
    : v.activePlayerNum === 3 && v.numCards === 12
    ? // 3 players: player one (players[0]) follows player three (players[2])
      ((v.activePlayerNum = 1),
      (players[2].activePlayer = false),
      (players[0].activePlayer = true),
      playerThreeArea.classList.remove("active-area"),
      playerOneArea.classList.add("active-area"),
      (activeCards = playerOneCard),
      eventsCards())
    : v.activePlayerNum === 3
    ? // 4 players: player four (players[3]) follows player three (players[2])
      ((v.activePlayerNum = 4),
      (players[2].activePlayer = false),
      (players[3].activePlayer = true),
      playerThreeArea.classList.remove("active-area"),
      playerFourArea.classList.add("active-area"),
      (activeCards = playerFourCard),
      eventsCards())
    : // player one (players[0]) always follows player four (players[3])
      ((v.activePlayerNum = 1),
      (players[3].activePlayer = false),
      (players[0].activePlayer = true),
      playerFourArea.classList.remove("active-area"),
      playerOneArea.classList.add("active-area"),
      (activeCards = playerOneCard),
      eventsCards());

  // Clear arrays for next player
  cardsToExtraHand.length = 0;
  cardsFromExtraHand.length = 0;

  // Check if current player used "buy" on last turn, if so reset to false
  if (players[idx].buyLastTurn) {
    players[idx].buyLastTurn = false;
  }

  // Update idx with new value of activePlayerNum
  idx = v.activePlayerNum - 1;
  // Check whether to endRound() if the next player used "hold" on last turn
  if (players[idx].holdLastTurn) {
    // Set all .holdLastTurn properties to false - prevents repeating endRound
    players.forEach(player => (player.holdLastTurn = false));
    endRound();
  }
};

export const check31Or33 = (playerNum = null) => {
  let idxPlayers = playerNum - 1; // Convert player number to zero-based index
  let playerHas31 = [];
  // If a player's score is 31 or 33, the round ends immediately
  // Check if any players have been dealt 33 or 31
  if (playerNum === null) {
    players.forEach(player => {
      if (player.currentScore === 33) {
        endRound("Feuer", 33);
      } else if (player.currentScore === 31) {
        playerHas31.push(player.player);
        console.log(`Player ${player.player} has 31!`);
      }
    });
    // If any player has 31, end the round, if not change the active player
    playerHas31.length > 0 ? endRound("Schnautz", 31) : changeActivePlayer();

    // else if (playerNum !== null) check if a player has 33 or 31
  } else if (players[idxPlayers].currentScore === 33) {
    endRound("Feuer", 33);
  } else if (players[idxPlayers].currentScore === 31) {
    endRound("Schnautz", 31);
    // if (playerNum !== null) and no player has 33 or 31
  } else {
    changeActivePlayer();
  }
};

// Deal card objects
const deal = () => {
  if (activeGame && activeRound === false) {
    activeRound = true;
    dealButton.textContent = "Score";
    // Generate a deck of cards, shuffle, and assign cards to players' hands
    assignCardsToPlayers(shuffle(newDeck()));
    // "Deal" cards to screen
    if (v.numCards === 15) {
      for (let i = 0; i <= 2; i++) {
        extraCard[i].textContent = extraHand[i].card;
        players[0].position === "dealer"
          ? (playerOneCard[i].textContent = dealerHand[i].card)
          : players[0].position === "leftOfDealer"
          ? (playerOneCard[i].textContent = leftOfDealerHand[i].card)
          : players[0].position === "acrossFromDealer"
          ? (playerOneCard[i].textContent = acrossFromDealerHand[i].card)
          : (playerOneCard[i].textContent = rightOfDealerHand[i].card);
        players[1].position === "dealer"
          ? (playerTwoCard[i].textContent = dealerHand[i].card)
          : players[1].position === "leftOfDealer"
          ? (playerTwoCard[i].textContent = leftOfDealerHand[i].card)
          : players[1].position === "acrossFromDealer"
          ? (playerTwoCard[i].textContent = acrossFromDealerHand[i].card)
          : (playerTwoCard[i].textContent = rightOfDealerHand[i].card);
        players[2].position === "dealer"
          ? (playerThreeCard[i].textContent = dealerHand[i].card)
          : players[2].position === "leftOfDealer"
          ? (playerThreeCard[i].textContent = leftOfDealerHand[i].card)
          : players[2].position === "acrossFromDealer"
          ? (playerThreeCard[i].textContent = acrossFromDealerHand[i].card)
          : (playerThreeCard[i].textContent = rightOfDealerHand[i].card);
        players[3].position === "dealer"
          ? (playerFourCard[i].textContent = dealerHand[i].card)
          : players[3].position === "leftOfDealer"
          ? (playerFourCard[i].textContent = leftOfDealerHand[i].card)
          : players[3].position === "acrossFromDealer"
          ? (playerFourCard[i].textContent = acrossFromDealerHand[i].card)
          : (playerFourCard[i].textContent = rightOfDealerHand[i].card);
      }
    } else if (v.numCards === 12) {
      for (let i = 0; i <= 2; i++) {
        extraCard[i].textContent = extraHand[i].card;
        players[0].position === "dealer"
          ? (playerOneCard[i].textContent = dealerHand[i].card)
          : players[0].position === "leftOfDealer"
          ? (playerOneCard[i].textContent = leftOfDealerHand[i].card)
          : (playerOneCard[i].textContent = acrossFromDealerHand[i].card);
        players[1].position === "dealer"
          ? (playerTwoCard[i].textContent = dealerHand[i].card)
          : players[1].position === "leftOfDealer"
          ? (playerTwoCard[i].textContent = leftOfDealerHand[i].card)
          : (playerTwoCard[i].textContent = acrossFromDealerHand[i].card);
        players[2].position === "dealer"
          ? (playerThreeCard[i].textContent = dealerHand[i].card)
          : players[2].position === "leftOfDealer"
          ? (playerThreeCard[i].textContent = leftOfDealerHand[i].card)
          : (playerThreeCard[i].textContent = acrossFromDealerHand[i].card);
      }
    } else {
      for (let i = 0; i <= 2; i++) {
        extraCard[i].textContent = extraHand[i].card;
        players[0].position === "dealer"
          ? (playerOneCard[i].textContent = dealerHand[i].card)
          : (playerOneCard[i].textContent = leftOfDealerHand[i].card);
        players[1].position === "dealer"
          ? (playerTwoCard[i].textContent = dealerHand[i].card)
          : (playerTwoCard[i].textContent = leftOfDealerHand[i].card);
      }
    }
    // Spades and clubs should be black (default is red)
    styleBlackCards();
    // Update scores to avoid currentScore: null on an early Schnautz/Feuer
    players.forEach(player => updateScore(player.player));
    // Check if the dealer dealt a Schnautz/Feuer to any player
    check31Or33();
  }
};
dealButton.addEventListener("click", deal);

// ///// GAME PLAY FUNCTIONS ///////////////////////////////////

// Exchange 1 or 3 cards from a player's hand with the extra hand
const exchangeCards = () => {
  // Note: mutates the objects that newDeck() created inside an array
  if (activeGame && activeRound) {
    // Note: All arrays below reference the same deck card objects

    // Bind the current player's position ("leftOfDealerHand", etc) to a variable
    let swapToCardPosition = cardsToExtraHand[0].cardPosition;
    // Bind the Nodelist of the current player's cards to a variable
    let playerNumberCard =
      v.activePlayerNum === 1
        ? playerOneCard // document.querySelectorAll(".playerOneCard")
        : v.activePlayerNum === 2
        ? playerTwoCard
        : v.activePlayerNum === 3
        ? playerThreeCard
        : playerFourCard;

    if (cardsToExtraHand.length === 1 && cardsFromExtraHand.length === 1) {
      // Check in the extraHand for the index of the selected card - bind to a variable
      let idxFromExtraHand = extraHand.indexOf(cardsFromExtraHand[0]);
      let idxFromExtraNode;
      let idxToExtraHand;
      let idxToPlayNode;

      // Switch .cardPosition property values e.g. "leftOfDealerHand" for "extraHand"
      cardsFromExtraHand[0].cardPosition = swapToCardPosition;
      cardsToExtraHand[0].cardPosition = "extraHand";
      // Switch .cardPlayerNum property values (extra is always 0)
      cardsFromExtraHand[0].cardPlayerNum = v.activePlayerNum;
      cardsToExtraHand[0].cardPlayerNum = 0;
      cardsFromExtraHand[0].selected = false;
      cardsToExtraHand[0].selected = false;

      // Replace one card object from extraHand with cardsToExtraHand[0]
      extraHand.splice(idxFromExtraHand, 1, cardsToExtraHand[0]);

      // Remove and replace one card object from the player's hand
      if (swapToCardPosition === "leftOfDealerHand") {
        idxToExtraHand = leftOfDealerHand.indexOf(cardsToExtraHand[0]);
        leftOfDealerHand.splice(idxToExtraHand, 1, cardsFromExtraHand[0]);
      } else if (swapToCardPosition === "acrossFromDealerHand") {
        idxToExtraHand = acrossFromDealerHand.indexOf(cardsToExtraHand[0]);
        acrossFromDealerHand.splice(idxToExtraHand, 1, cardsFromExtraHand[0]);
      } else if (swapToCardPosition === "rightOfDealerHand") {
        idxToExtraHand = rightOfDealerHand.indexOf(cardsToExtraHand[0]);
        rightOfDealerHand.splice(idxToExtraHand, 1, cardsFromExtraHand[0]);
      } else {
        idxToExtraHand = dealerHand.indexOf(cardsToExtraHand[0]);
        dealerHand.splice(idxToExtraHand, 1, cardsFromExtraHand[0]);
      }

      // Retrieve index from NodeList and modify textContent && classlist
      extraCard.forEach((card, idx) => {
        if (card.textContent === cardsFromExtraHand[0].card) {
          idxFromExtraNode = idx;
        }
      });
      extraCard[idxFromExtraNode].textContent = cardsToExtraHand[0].card;
      extraCard[idxFromExtraNode].classList.remove("is-active");

      // Retrieve index from NodeList and modify textContent && classlist
      playerNumberCard.forEach((card, idx) => {
        if (card.textContent === cardsToExtraHand[0].card) {
          idxToPlayNode = idx;
        }
      });
      playerNumberCard[idxToPlayNode].textContent = cardsFromExtraHand[0].card;
      playerNumberCard[idxToPlayNode].classList.remove("is-active");
      styleBlackCards();
      updateScore(v.activePlayerNum);
      check31Or33(v.activePlayerNum);
    } else if (
      cardsToExtraHand.length === 3 &&
      cardsFromExtraHand.length === 3
    ) {
      // Swap three cards to the extraHand
      extraHand.splice(0, 3, ...cardsToExtraHand);
      for (let i = 0; i <= 2; i++) {
        extraCard[i].textContent = extraHand[i].card;
        extraCard[i].classList.remove("is-active");
        extraHand[i].cardPosition = "extraHand";
        extraHand[i].selected = false;
      }

      // Swap three cards to the current player's hand
      if (swapToCardPosition === "leftOfDealerHand") {
        leftOfDealerHand.splice(0, 3, ...cardsFromExtraHand);
        for (let i = 0; i <= 2; i++) {
          playerNumberCard[i].textContent = leftOfDealerHand[i].card;
          playerNumberCard[i].classList.remove("is-active");
          leftOfDealerHand[i].cardPosition = "leftOfDealerHand";
          leftOfDealerHand[i].selected = false;
        }
      } else if (swapToCardPosition === "acrossFromDealerHand") {
        acrossFromDealerHand.splice(0, 3, ...cardsFromExtraHand);
        for (let i = 0; i <= 2; i++) {
          playerNumberCard[i].textContent = acrossFromDealerHand[i].card;
          playerNumberCard[i].classList.remove("is-active");
          acrossFromDealerHand[i].cardPosition = "acrossFromDealerHand";
          acrossFromDealerHand[i].selected = false;
        }
      } else if (swapToCardPosition === "rightOfDealerHand") {
        rightOfDealerHand.splice(0, 3, ...cardsFromExtraHand);
        for (let i = 0; i <= 2; i++) {
          playerNumberCard[i].classList.remove("is-active");
          playerNumberCard[i].textContent = rightOfDealerHand[i].card;
          rightOfDealerHand[i].cardPosition = "rightOfDealerHand";
          rightOfDealerHand[i].selected = false;
        }
      } else if (swapToCardPosition === "dealerHand") {
        dealerHand.splice(0, 3, ...cardsFromExtraHand);
        for (let i = 0; i <= 2; i++) {
          playerNumberCard[i].classList.remove("is-active");
          playerNumberCard[i].textContent = dealerHand[i].card;
          dealerHand[i].cardPosition = "dealerHand";
          dealerHand[i].selected = false;
        }
      } else {
        alert("Error: Unable to exchange three cards.");
      }
      styleBlackCards();
      updateScore(v.activePlayerNum);
      check31Or33(v.activePlayerNum);
    } else {
      alert("Error: Unable to exchange cards.");
    }
  } else {
    alert("Error: Game or round is not active.");
  }
  // console.log(extraHand);
};
exchangeButton.addEventListener("click", exchangeCards);

// // Current player skips turn but cannot skip two turns in a row
// const buy = () => {
//   let idx = activePlayerNum - 1;
//   // check if player used "buy" on last turn
//   if (players[idx].buyLastTurn === true) {
//     alert(`Player ${activePlayerNum} cannot buy this turn.`);
//   } else {
//     players[idx].buyLastTurn = true;
//     aCard.forEach(card => card.classList.remove("is-active"));
//     updateScore(activePlayerNum);
//     check31Or33(activePlayerNum);
//   }
// };
buyButton.addEventListener("click", buy);

// // Current player skips turn and signals this round is ending
// const hold = () => {
//   let idx = activePlayerNum - 1;
//   players[idx].holdLastTurn = true;
//   aCard.forEach(card => card.classList.remove("is-active"));
//   updateScore(activePlayerNum);
//   check31Or33(activePlayerNum);
//   // Other players have one more turn (but not current player)
// };
holdButton.addEventListener("click", hold);

// ///// KEEPERS ///////////////////////////////////////////////
// Alternatives for suits
// White club suit 	♧ 	U+2667 	&#9831 -- Black club suit 	♣ 	U+2663 	&clubs
// White diamond suit 	♢ 	U+2662 	&#9826 -- Black diamond suit 	♦ 	U+2666 	&diams
// White heart suit 	♡ 	U+2661 	&#9825 -- Black heart suit 	♥ 	U+2665 	&hearts
// White spade suit 	♤ 	U+2664 	&#9828 -- Black spade suit 	♠ 	U+2660 	&spade
