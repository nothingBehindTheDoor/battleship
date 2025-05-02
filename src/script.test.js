import { Ship, Gameboard } from "./script";

describe("Ship class test", () => {
  const testShip = new Ship(4);

  it("should return a ship object with a length of four", () => {
    expect(testShip.length).toBe(4);
  });

  it("should increase the hitCount variable when the hit method is called", () => {
    testShip.hit();
    expect(testShip.hitCount).toBe(1);
    testShip.hit();
    expect(testShip.hitCount).toBe(2);
  });

  it("should have a functional isSunk method", () => {
    testShip.hit();
    testShip.hit();
    expect(testShip.isSunk()).toBe(true);
  });
});

describe("Gameboard tests", () => {
  const testBoard = new Gameboard();
  it("should have a board", () => {
    expect(testBoard.board instanceof Array).toEqual(true);
  });

  it("should have a method for placing ships", () => {
    testBoard.placeShip([0, 1], [4, 1]);
    expect(testBoard.board[4][1].ship instanceof Ship).toBe(true);
  });

  it("shouldn't allow placement of ships on top of each other", () => {
    testBoard.placeShip([1, 0], [1, 3]);
    expect(testBoard.board[1][0].ship instanceof Ship).toBe(false);
  });

  it("should have a method for attacking squares", () => {
    testBoard.receiveAttack([0, 1]);
    expect(testBoard.board[0][1].hit).toBe(true);
    expect(testBoard.board[0][1].ship.hitCount).toBe(1);
  });

  it("should have a method that returns true/false based on whether all the ships on it are sunk", () => {
    testBoard.receiveAttack([0, 1]);
    testBoard.receiveAttack([1, 1]);
    testBoard.receiveAttack([2, 1]);
    expect(testBoard.allSunken()).toBe(false);
    testBoard.receiveAttack([3, 1]);
    testBoard.receiveAttack([4, 1]);
    expect(testBoard.allSunken()).toBe(true);
  })
});
