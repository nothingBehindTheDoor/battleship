class Ship {
    constructor(length) {
        this.length = length;
        this.hitCount = 0;
        this.sunk = false;
    }

    hit() {
        this.hitCount++;
    }

    isSunk() {
        if (this.length <= this.hitCount) {
            this.sunk = true;
            return this.sunk;
        }
    }
}

export { Ship };
