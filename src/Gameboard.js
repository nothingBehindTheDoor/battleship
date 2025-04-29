import { Ship } from "./script";

class Gameboard {
    constructor() {
        this.board = [[], [], [], [], [], [], [], []];
    }

    placeShip(cs1, cs2) {
        // cs1 = [cs1[0].charCodeAt(0) - 97, cs1[1] - 1];
        // cs2 = [cs2[0].charCodeAt(0) - 97, cs2[1] - 1];
        let length;
        if (cs1[0] === cs2[0]) {
            length = Math.max(cs1[1], cs2[1]) - Math.min(cs1[1], cs2[1]) + 1;
        } else {
            length = Math.max(cs1[0], cs2[0]) - Math.min(cs1[0], cs2[0]) + 1;
        }
        const ship = new Ship(length);

        
    }

    receiveAttack(c1, c2) {

    }
}

export { Gameboard };
