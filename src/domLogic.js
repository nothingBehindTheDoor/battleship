const body = document.querySelector("body");
const main = document.querySelector("main");
import { Gameboard } from "./script";
import { player, enemy, Ship } from "./script";

function displayBoards(board1, board2) {
  const playerBoard = document.querySelector(".player");
  const enemyBoard = document.querySelector(".enemy");

  playerBoard.innerHTML = "";
  enemyBoard.innerHTML = "";

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      const squareDiv = document.createElement("div");
      squareDiv.classList.add(`${i}${j}`);
      squareDiv.classList.add(`square`);
      if (board1[i][j].ship) {
        squareDiv.classList.add("occupied");
      }
      if (board1[i][j].horizontal) {
        squareDiv.classList.add("horizontal");
      }

      if (board1[i][j].ship && board1[i][j].ship.isSunk()) {
        squareDiv.classList.add("ship-sunk");
      } else if (board1[i][j].hit && board1[i][j].ship) {
        squareDiv.classList.add("ship-hit");
      } else if (board1[i][j].hit) {
        squareDiv.classList.add("hit");
      }

      const squareDiv2 = document.createElement("div");
      squareDiv2.classList.add(`${i}${j}`);
      squareDiv2.classList.add(`square`);
      if (board2[i][j].ship && board2[i][j].ship.isSunk()) {
        squareDiv2.classList.add("ship-sunk");
      } else if (board2[i][j].hit && board2[i][j].ship) {
        squareDiv2.classList.add("ship-hit");
      } else if (board2[i][j].hit) {
        squareDiv2.classList.add("hit");
      }

      playerBoard.append(squareDiv);
      enemyBoard.append(squareDiv2);
    }
  }
}

function placeShips(board1, board2) {
  document.querySelector(".enemy").classList.toggle("no-touch");
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
      // removes the class that makes the enemy board blurred/greyed out
      document.querySelector(".enemy").classList.toggle("no-touch");
      startRound();
      return;
    }
    let coordinates = [];
    // listener that records the users first and second clicked square and then passes them to checkCoords
    document.querySelector(".player").addEventListener(
      "click",
      (e) => {
        e.target.classList.toggle("clicked");
        coordinates.push([...e.target.classList[0].split("")]);
        document.querySelector(".player").addEventListener(
          "click",
          (ev) => {
            e.target.classList.toggle("clicked");
            if (ev.target === e.target) {
              getCoord();
              return;
            }
            coordinates.push([...ev.target.classList[0].split("")]);
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
  console.log(enemy.board.board);
  playerTurn();
  function playerTurn() {
    document.querySelector("#title-heading").textContent =
      "Click on a square to attack the enemy!";
    document.querySelector(".player").classList.toggle("no-touch");
    document.querySelector(".enemy").addEventListener(
      "click",
      (e) => {
        enemy.board.receiveAttack(e.target.classList[0].split(""))
          ? e.target.classList.add("ship-hit")
          : e.target.classList.add("hit");
        displayBoards(player.board.board, enemy.board.board);
        if (enemy.board.allSunken()) {
          document.querySelector("dialog").showModal();
          document.querySelector("#dialog-txt").textContent = "You won !!! :D";
        } else {
          document.querySelector(".player").classList.toggle("no-touch");
          enemyTurn();
        }
      },
      { once: true }
    );
  }

  let nextTargets = [];
  function enemyTurn() {
    if (!document.querySelector(".enemy").classList.contains("no-touch")) document.querySelector(".enemy").classList.toggle("no-touch");
    document.querySelector("#title-heading").textContent = "Enemy's turn!";

    let cs = [];
    // nextTargets is a queue to which an array containing adjacent coordinates is pushed if the enemy hits something.
    if (nextTargets[0]) {
      if (nextTargets[0].length === 0) nextTargets.shift();
      cs = nextTargets[0].shift();
      switch (player.board.receiveAttack(cs)) {
        case null:
          enemyTurn();
          return;
        case true:
          if (nextTargets[0].length === 0) nextTargets.shift();
          nextTargets.unshift([]);
          for (let i = 0; i < 2; i++) {
            let target1 = [...cs];
            let target2 = [...cs];
            if (cs[i] > 0) {
              target1[i]--;
              nextTargets.at(-1).push(target1);
            }
            if (cs[i] < 7) {
              target2[i]++;
              nextTargets.at(-1).push(target2);
            }
          }
          break;
        case false:
          break;
        case "sunk":
          nextTargets.shift();
          break;
      }
      console.log(nextTargets, cs);
    } else {
      cs.push(Math.floor(Math.random() * 7.99));
      cs.push(Math.floor(Math.random() * 7.99));

      switch (player.board.receiveAttack(cs)) {
        case null:
          enemyTurn();
          return;
        case true:
          nextTargets.unshift([]);
          for (let i = 0; i < 2; i++) {
            let target1 = [...cs];
            let target2 = [...cs];
            if (cs[i] > 0) {
              target1[i]--;
              nextTargets.at(-1).push(target1);
            }
            if (cs[i] < 7) {
              target2[i]++;
              nextTargets.at(-1).push(target2);
            }
          }
          break;
        case false:
          break;
        case "sunk":
          nextTargets.shift();
          break;
      }
      console.log(nextTargets, cs);
    }

    if (player.board.allSunken()) {
      displayBoards(player.board.board, enemy.board.board);
      document.querySelector("dialog").showModal();
      document.querySelector("#dialog-txt").textContent = "You lost ... D:";
    } else {
      setTimeout(() => {
        displayBoards(player.board.board, enemy.board.board);
        document.querySelector(".enemy").classList.toggle("no-touch");
        setTimeout(playerTurn, 1000);
      }, 3000);
    }
  }
}

function getSurroundingSquares(cs, board) {
  let arr = [];
  arr.push();
}

// dialog box new game btn
document.querySelector("#dialog-btn").addEventListener("click", (e) => {
  document.querySelector("dialog").close();
  window.location.reload();
});

export { displayBoards, placeShips };
