import { gameState } from "./gameStatus.js";
import { messageArea, myPetNames } from "./addPlayers.js";
import { players } from "./generate.js";
import { hold } from "./buyHold.js";

const dealerHand = []; //* Array of dealer's hand's three card objects
const leftOfDealerHand = []; //*...of player left of dealer...
const acrossFromDealerHand = []; //* ...of player across from dealer...
const rightOfDealerHand = []; //* ...of player right of dealer...

let catSawCards = 0;
let dogSawCards = 0;
let gatorSawCards = 0;

//> Create animal sets if animals are playing: assignCardsToPlayers() calls
//> creatAnimalSets(), which passes the extraHand array of 3 card objects
const createAnimalSets = (cards) => {
  players.forEach((player) => {
    let arr;
    if (player.animal) {
      player.position === "dealer"
        ? (arr = dealerHand)
        : player.position === "leftOfDealer"
        ? (arr = leftOfDealerHand)
        : player.position === "acrossFromDealer"
        ? (arr = acrossFromDealerHand)
        : player.position === "rightOfDealer"
        ? (arr = rightOfDealerHand)
        : console.log("Cannot find hand");

      player.name === myPetNames[0]
        ? (catSawCards = new Set([...cards, ...arr]))
        : player.name === myPetNames[1]
        ? (dogSawCards = new Set([...cards, ...arr]))
        : player.name === myPetNames[2]
        ? (gatorSawCards = new Set([...cards, ...arr]))
        : console.log("Cannot find pet");
    }
  });
  //* If we created an animal set, gameState.animals is set true (an animal is playing)
  if (catSawCards.size > 0 || dogSawCards.size > 0 || gatorSawCards.size > 0) {
    gameState.animals = true;
  }
};

//> Update animal sets with cards seen: exchangeCards() calls updateCardsSeen(),
//> which passes 1 or 3 card objects from the updated extraHand array
const updateCardsSeen = (cards) => {
  //* cards parameter is an array of 1 or 3 card objects
  cards.forEach((card) => {
    catSawCards.add(card);
    dogSawCards.add(card);
    gatorSawCards.add(card);
  });
  console.log(catSawCards, dogSawCards, gatorSawCards);
};

//> Clear sets on after round ends
const clearAnimalSets = () => {
  if (catSawCards.size > 0) catSawCards.clear();
  if (dogSawCards.size > 0) dogSawCards.clear();
  if (gatorSawCards.size > 0) gatorSawCards.clear();
};

//> Check if dealer is an animal--changeDealer passes dealer's player object
const dealIfAnimal = (dealer) => {
  //todo code
  console.log(dealer);
};

//> changeActivePlayer() passes animal player object
//> Animal decides whether to exchange, buy, or hold this turn
const thinkLikeAnimal = (animal) => {
  if (animal.currentScore >= 22) {
    messageArea.innerHTML = `<h5>${animal.name} holds.`;
    hold();
  }
};

export {
  thinkLikeAnimal as default,
  clearAnimalSets,
  createAnimalSets,
  dealIfAnimal,
  updateCardsSeen,
  dealerHand,
  leftOfDealerHand,
  acrossFromDealerHand,
  rightOfDealerHand
};
