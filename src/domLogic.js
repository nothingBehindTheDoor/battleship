const body = document.querySelector("body");
const main = document.querySelector("main");
import { Gameboard } from "./script";
import { player, enemy } from "./script";

function displayBoards(board1, board2) {
  main.innerHTML = `<div id="main-inner">
        <div id="player">
            <div class="board-header player-board-header">Your ships</div>
            <div class="player board"></div>
        </div>
        <div id="Attack">
            <div class="board-header enemy-board-header">Attack enemy</div>
            <div class="enemy board"></div>
        </div>
    </div>`;

  const playerBoard = document.querySelector(".player");
  const enemyBoard = document.querySelector(".enemy");

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add(`${i}${j}`);
      squareDiv.classList.add(`square`);
      if (board1[i][j].ship) {
        squareDiv.classList.add("occupied");
      }
      if (board1[i][j].hit) {
        squareDiv.classList.add("hit");
      }

      const squareDiv2 = document.createElement("div");
      squareDiv2.classList.add(`${i}${j}`);
      squareDiv2.classList.add(`square`);
      if (board2[i][j].hit) {
        squareDiv2.classList.add("hit");
      }
      if (board2[i][j].hit && board2[i][j].ship) {
        squareDiv2.classList.add("ship-hit");
      }

      playerBoard.append(squareDiv);
      enemyBoard.append(squareDiv2);
    }
  }
}

function placeShips(board1, board2) {
  // this bit is for the enemy ships
  const enemyShips = { 5: 1, 4: 2, 3: 4 };
  for (let [length, count] of Object.entries(enemyShips)) {
    while (count > 0) {
      let cs1 = [];
      let cs2 = [];
      const rowOrColumn = Math.floor(Math.random() * 2);
      const randomRowOrColumn = Math.floor(Math.random() * 7.99);
      cs1[rowOrColumn] = randomRowOrColumn;
      cs2[rowOrColumn] = randomRowOrColumn;
      if (rowOrColumn === 0) {
        const firstCoord = Math.floor(Math.random() * (8 - +length));
        const secondCoord = firstCoord + +length - 1;
        cs1[1] = firstCoord;
        cs2[1] = secondCoord;
      } else {
        const firstCoord = Math.floor(Math.random() * (8 - +length));
        const secondCoord = firstCoord + +length - 1;
        cs1[0] = firstCoord;
        cs2[0] = secondCoord;
      }
      if (board2.placeShip(cs1, cs2)) count--;
    }
  }
  document.querySelector(".player-board-header").textContent =
    "Place your ships.\nShips: ";
  let ships = { 5: 1, 4: 2, 3: 4 };

  function getCoord() {
    // checks that there are ships left to be placed
    if (Object.values(ships).reduce((prev, cur) => prev + cur) === 0) {
      console.log("return");
      startRound();
      return;
    }
    let coordinates = [];
    // listener that records the users first and second clicked square and then passes them to checkCoords
    document.querySelector(".player").addEventListener(
      "click",
      (e) => {
        coordinates.push([...e.target.classList[0].split("")]);
        document.querySelector(".player").addEventListener(
          "click",
          (e) => {
            coordinates.push([...e.target.classList[0].split("")]);
            checkCoords();
          },
          { once: true }
        );
      },
      { once: true }
    );
    function checkCoords() {
      // checking that the desired ship placement isn't diagonal
      if (
        coordinates[0][0] !== coordinates[1][0] &&
        coordinates[0][1] !== coordinates[1][1]
      ) {
        temporaryTextContent(
          "Can't place ships diagonally",
          document.querySelector(".player-board-header")
        );
        // and starting the process over
        getCoord();
      } else {
        let length;
        // calculating the length of the ship
        if (coordinates[0][0] === coordinates[1][0]) {
          if (coordinates[0][1] > coordinates[1][1]) {
            length = coordinates[0][1] - coordinates[1][1] + 1;
            // kay so this reverse is here because if the bigger coordinate comes first it messes up the Gameboard.placeShip function. yeah.
            coordinates.reverse();
          } else {
            length = coordinates[1][1] - coordinates[0][1] + 1;
          }
        } else {
          if (coordinates[0][0] > coordinates[1][0]) {
            length = coordinates[0][0] - coordinates[1][0] + 1;
            const temp = coordinates[0];
            // same here.
            coordinates.reverse();
          } else {
            length = coordinates[1][0] - coordinates[0][0] + 1;
          }
        }
        console.log(coordinates);

        if (length > 5 || length < 3) {
          temporaryTextContent(
            "Ship too long/short!",
            document.querySelector(".player-board-header")
          );
          getCoord();
        } else {
          // if there are ships of desired length left
          if (ships[length]) {
            // if placeShip returns false it means the square is occupied and we start over from getCoord
            if (board1.placeShip(...coordinates)) {
              ships[length]--;
              getCoord();
            } else {
              temporaryTextContent(
                "Square already occupied by another ship!",
                document.querySelector(".player-board-header")
              );
              getCoord();
            }
            displayBoards(board1.board, board2.board);
            getCoord();
          } else {
            temporaryTextContent(
              `No more ships of length ${length} to be placed!`,
              document.querySelector(".player-board-header")
            );
            getCoord();
          }
        }
      }
    }
  }

  getCoord();
}

function temporaryTextContent(text, node, time = 3000) {
  const defaultText = node.textContent;
  node.textContent = text;
  setTimeout(() => {
    node.textContent = defaultText;
  }, time);
}

function startRound() {

  playerTurn();
  function playerTurn() {
    document.querySelector("#title-heading").textContent =
    "Click on a square to attack the enemy!";
    document.querySelector(".enemy").addEventListener("click", (e) => {
      enemy.board.receiveAttack(e.target.classList[0].split(""))
        ? e.target.classList.add("ship-hit")
        : e.target.classList.add("hit");
      if (enemy.board.allSunken()) {
        console.log("HURRAY !!!");
      } else {
        enemyTurn();
      }
    });
  }

  function enemyTurn() {
    document.querySelector("#title-heading").textContent =
    "Enemy's turn!";
    const cs = [Math.floor(Math.random * 7.99), Math.floor(Math.random * 7.99)];
    console.log(cs);
  }
}

export { displayBoards, placeShips };
