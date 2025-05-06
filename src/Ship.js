class Ship {
    constructor(length) {
        this.length = length;
        this.hitCount = 0;
        this.sunk = false;
        // this.hit = function(){
        //     this.hitCount++;
        //     if (this.isSunk()) this.sunk = true;
        // };
        // this.isSunk = function() {
        //     if (this.length <= this.hitCount) {
        //         this.sunk = true;
        //         return this.sunk;
        //     }
        // };
    }

    hit() {
        this.hitCount++;
        if (this.isSunk()) this.sunk = true;
    }

    isSunk() {
        if (this.length <= this.hitCount) {
            this.sunk = true;
            return this.sunk;
        }
    }
}

export { Ship };
