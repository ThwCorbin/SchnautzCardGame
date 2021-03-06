//> Card deck functions
const aCard = document.querySelectorAll(".aCard"); //* all cards

//> Generate a new deck (an array of card objects), which we pass to shuffle()
const newDeck = () => {
  const suits = ["♧", "♢", "♡", "♤"];
  const ranks = ["7", "8", "9", "10", "J", "Q", "K", "A"];
  const deck = [];
  //* Build fresh deck as an array of objects.
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({
        card: ranks[i] + suits[j],
        rank: ranks[i],
        suit: suits[j],
        points:
          i === 7 ? 11 : i === 4 || i === 5 || i === 6 ? 10 : Number(ranks[i]),
        cardPosition: "",
        cardPlayerNum: null,
        selected: false
      });
    }
  }
  return deck;
};

//> Generate a shuffled deck from newDeck()'s array of card objects,
//> which we pass to assignCardsToPlayers()
const shuffle = (deck) => {
  //* Fisher–Yates Shuffle
  let numUnshuffledCards = deck.length;
  //* 32 card deck using 7 through ace
  let randomUnshuffledCard;
  let lastUnshuffledCard;
  //* Select and move a random unshuffled card to the shuffled portion of the array
  //* Move the card the random card replaced to the unshuffled portion of the array
  while (numUnshuffledCards) {
    //* While unshuffled cards remain,
    randomUnshuffledCard = Math.floor(Math.random() * numUnshuffledCards--);
    //* Pick a random card from the unshuffled portion of the deck,
    //* and decrement the number of unshuffled cards by 1 so we can...
    lastUnshuffledCard = deck[numUnshuffledCards];
    //* Assign the last card in the unshuffled portion of the array to a variable
    deck[numUnshuffledCards] = deck[randomUnshuffledCard];
    //* Move the random card to the last unshuffled card's position
    deck[randomUnshuffledCard] = lastUnshuffledCard;
    //* Move the last unshuffled card to the random card's previous position
  }
  //* Return the shuffled deck to assignCardsToPlayers()
  return deck;
};

//> Style black cards
const styleBlackCards = () => {
  aCard.forEach((card) =>
    card.textContent.includes("♤")
      ? card.classList.add("aCardBlack")
      : card.textContent.includes("♧")
      ? card.classList.add("aCardBlack")
      : card.classList.remove("aCardBlack")
  );
};

export { newDeck as default, aCard, shuffle, styleBlackCards };

//> Alternatives for suits
//* White club suit 	♧ 	U+2667 	&#9831 -- Black club suit 	♣ 	U+2663 	&clubs
//* White diamond suit 	♢ 	U+2662 	&#9826 -- Black diamond suit 	♦ 	U+2666 	&diams
//* White heart suit 	♡ 	U+2661 	&#9825 -- Black heart suit 	♥ 	U+2665 	&hearts
//* White spade suit 	♤ 	U+2664 	&#9828 -- Black spade suit 	♠ 	U+2660 	&spade
