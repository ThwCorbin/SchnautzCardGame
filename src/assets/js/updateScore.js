import changeActivePlayer from "./changeActivePlayer.js";
import endRound from "./endRound.js";
import { allHands } from "./cardHands.js";
import { players } from "./generate.js";

//> Update player scores and check for 31 (Schnautz) or 33 (Feuer)
const updateScore = (playerNum) => {
  let idxPlayers = playerNum - 1; //* Convert player number to zero-based index
  let idxAllHands; //* Set using players[idxPlayers].position property
  //* allHands[0] is extraHand, allHands[1] is dealerHand, etc
  players[idxPlayers].position === "dealer"
    ? (idxAllHands = 1)
    : players[idxPlayers].position === "leftOfDealer"
    ? (idxAllHands = 2)
    : players[idxPlayers].position === "acrossFromDealer"
    ? (idxAllHands = 3)
    : (idxAllHands = 4);

  //* If all three cards are the same suit, add the points
  //* .points property stores point value of A(11),K(10),Q(10),J(10),10,9,8,7
  allHands[idxAllHands][0].suit === allHands[idxAllHands][1].suit &&
  allHands[idxAllHands][0].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points +
        allHands[idxAllHands][1].points +
        allHands[idxAllHands][2].points)
    : //* If two cards are the same suit, add the points
    allHands[idxAllHands][0].suit === allHands[idxAllHands][1].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points + allHands[idxAllHands][1].points)
    : allHands[idxAllHands][0].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][0].points + allHands[idxAllHands][2].points)
    : allHands[idxAllHands][1].suit === allHands[idxAllHands][2].suit
    ? (players[idxPlayers].currentScore =
        allHands[idxAllHands][1].points + allHands[idxAllHands][2].points)
    : //* If all three cards are aces, the score is 33
    allHands[idxAllHands][0].rank === "A" &&
      allHands[idxAllHands][1].rank === "A" &&
      allHands[idxAllHands][2].rank === "A"
    ? (players[idxPlayers].currentScore = 33)
    : //* If all three cards are tens, the score is 30
    allHands[idxAllHands][0].rank === "10" &&
      allHands[idxAllHands][1].rank === "10" &&
      allHands[idxAllHands][2].rank === "10"
    ? (players[idxPlayers].currentScore = 30)
    : //* If all three cards are the same rank, the score is 30.5
    allHands[idxAllHands][0].rank === allHands[idxAllHands][1].rank &&
      allHands[idxAllHands][0].rank === allHands[idxAllHands][2].rank
    ? (players[idxPlayers].currentScore = 30.5)
    : //* Otherwise, the score is the point value of the highest card
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
};

const check31Or33 = (playerNum = null) => {
  let idxPlayers = playerNum - 1; // Convert player number to zero-based index
  let playerHas31 = [];
  //* After dealing, check if any players have been dealt 33 or 31
  if (playerNum === null) {
    players.forEach((player) => {
      if (player.currentScore === 33) {
        //* End the round because only one player may have 33 (3 aces) at a time
        endRound("Feuer", 33);
        //* Store players with 31 as multiple players may be dealt 31
      } else if (player.currentScore === 31) {
        playerHas31.push(player.player);
      }
    });
    //* If any player has been dealt 31, end the round; if not, play the round
    playerHas31.length > 0 ? endRound("Schnautz", 31) : changeActivePlayer();

    //* After a player's turn, check if that player has 33 or 31
  } else if (players[idxPlayers].currentScore === 33) {
    endRound("Feuer", 33);
  } else if (players[idxPlayers].currentScore === 31) {
    endRound("Schnautz", 31);
    //* If no player has 33 or 31, continue playing the round
  } else {
    changeActivePlayer();
  }
};

export { updateScore as default, check31Or33 };
