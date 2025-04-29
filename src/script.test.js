import { Ship, Gameboard } from "./script";

describe("Ship class test", () => {
    const testShip = new Ship(4);

    it("should return a ship object with a length of four", () => {
        expect(testShip.length).toBe(4);
    })

    it("should increase the hitCount variable when the hit method is called", () => {
        testShip.hit();
        expect(testShip.hitCount).toBe(1);
        testShip.hit();
        expect(testShip.hitCount).toBe(2);
    })

    it ("should have a functional isSunk method", () => {
        testShip.hit();
        testShip.hit();
        expect(testShip.isSunk()).toBe(true);
    })
})

describe("Gameboard class tests", () => {
    const testBoard = new Gameboard();
    it ("should have a method that places new ships on the board", () => {
        testBoard.placeShip(["0", "0"], ["2", "0"]);
        expect(testBoard.board[0][0].occupied).toBe(true);
    })
    it("shoul")
})