import { Ship } from "./script";

class Gameboard {
  constructor() {
    this.board = [[], [], [], [], [], [], [], []];
    this.ships = []; 
    for (const arr of this.board) {
      for (let i = 0; i < 8; i++) {
        arr.push({ hit: false, ship: null, horizontal: false });
      }
    }
  }

  placeShip(cs1, cs2) {
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
    let squaresOccupiedByNewShip = [];
    // if ship is placed horizontally
    if (horizontal) {
      // loops through all the squares the ship will occupy
      for (let i = cs1[1]; i <= cs2[1]; i++) {
        // if square occupied, abort.
        if (this.board[cs1[0]][i].ship) {
          return false;
        } else {
          // otherwise add the square's coords to the array
          squaresOccupiedByNewShip.push([cs1[0], i]);
        }
      }
      // if ship is placed vertically
    } else {
      // loops through all the squares the ship will occupy
      for (let i = cs1[0]; i <= cs2[0]; i++) {
        // if square occupied, abort.
        if (this.board[i][cs1[1]].ship) {
          return false;
        } else {
          // otherwise add the square's coords to the array
          squaresOccupiedByNewShip.push([+i, +cs1[1]])
        }
      }
    }
    // add ship to board
    for (const cs of squaresOccupiedByNewShip) {
      this.board[cs[0]][cs[1]].ship = ship;
      if (horizontal) this.board[cs[0]][cs[1]].horizontal = true;
    }
    this.ships.push(ship);
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
      if (!ship.isSunk()) return false;
    }
    return true;
  }
}

export { Gameboard };
