import { Ship } from "./script";

class Gameboard {
  constructor() {
    this.board = [[], [], [], [], [], [], [], []];
    this.ships = []; 
    for (const arr of this.board) {
      for (let i = 0; i < 8; i++) {
        arr.push({ hit: false, ship: null });
      }
    }
  }

  placeShip(cs1, cs2) {
    let tempBoard = JSON.parse(JSON.stringify(this.board));
    let length;
    // this gets flipped to true if the ship is placed horizontally, so we don't have to re-determine it later.
    let horizontal = false;
    // calculating the length of the ship so we can call the Ship constructor with the proper argument
    if (cs1[0] === cs2[0]) {
      length = cs1[1] > cs2[1] ? cs1[1] - cs2[1] + 1 : cs2[1] - cs1[1] + 1;
      horizontal = true;
    } else {
      length = cs1[0] > cs2[0] ? cs1[0] - cs2[0] + 1 : cs2[0] - cs1[0] + 1;
    }
    const ship = new Ship(length);
    // if ship is placed horizontally
    if (horizontal) {
      // loops through all the squares the ship will occupy
      for (let i = cs1[1]; i <= cs2[1]; i++) {
        // if square occupied, abort.
        if (tempBoard[cs1[0]][i].ship) {
          return false;
        }
        tempBoard[cs1[0]][i].ship = ship;
      }
      // if ship is placed vertically
    } else {
      // loops through all the squares the ship will occupy
      for (let i = cs1[0]; i <= cs2[0]; i++) {
        // if square occupied, abort.
        if (tempBoard[i][cs1[1]].ship) {
          return false;
        }
        tempBoard[i][cs1[1]].ship = ship;
      }
    }
    this.ships.push(ship);
    this.board = tempBoard;
    return true;
  }

  receiveAttack(cs) {
    const square = this.board[cs[0]][cs[1]];
    if (!square.hit && square.ship) square.ship.hit();
    square.hit = true;
    return square.ship ? true : false;
  }

  allSunken() {
    for (const ship of this.ships) {
      if (ship.isSunk()) return true;
    }
    return false;
  }
}

export { Gameboard };
