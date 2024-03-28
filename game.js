export class Game {
    #settings = {
        pointsToWin: 10,
        gridSize: {
            width: 4, height: 5,
        },
        googleJumpInterval: 2000,
    };
    #status = 'pending';
    #player1;
    #player2;
    #google;
    #score = {
        1: {points: 0,},
        2: {points: 0,}
    };
    #googleMovingIntervalId;

    constructor(eventEmitter) {
        this.eventEmitter = eventEmitter;
    }

    async start() {
        if (this.#status === 'pending') {
            this.#status = 'in-process';

            this.#createUnits();
            this.#runMovingGoogleInterval();
        }
    }

    async stop() {
        clearInterval(this.#googleMovingIntervalId);
        this.status = 'stopped';
    }

    async #finishGame() {
        clearInterval(this.#googleMovingIntervalId);
        // Easier and cleaner
        //this.#google = new Google(new Position({x: 0, y: 0}));
        this.status = 'finish';
    }

    #runMovingGoogleInterval() {
        this.#googleMovingIntervalId = setInterval(() => {
            this.#moveGoogle();
        }, this.#settings.googleJumpInterval)
    }

    #moveGoogle() {
        if (this.#status === 'finish') {
            this.#google = new Google(new Position({x: 0, y: 0}));
            this.eventEmitter.emitEventListener('update');
            return;
        }
        const googlePosition = new Position(
            Position.getNotCrossedPosition(
                [this.#player1.position, this.#player2.position, this.#google.position],
                this.#settings.gridSize.width,
                this.#settings.gridSize.height,
            ));
        this.#google = new Google(googlePosition);
        this.eventEmitter.emitEventListener('update');
    }

    #createUnits() {
        const maxGridWidthSize = this.#settings.gridSize.width;
        const maxGridHeightSize = this.#settings.gridSize.height;

        const player1Position = new Position(Position.getNotCrossedPosition(
            [], maxGridWidthSize, maxGridHeightSize
        ))
        this.#player1 = new Player(player1Position, 1);
        const player2Position = new Position(Position.getNotCrossedPosition([player1Position], maxGridWidthSize, maxGridHeightSize
        ))
        this.#player2 = new Player(player2Position, 2);

        const googlePosition = new Position(Position.getNotCrossedPosition([player1Position, player2Position], maxGridWidthSize, maxGridHeightSize
        ));
        this.#google = new Google(googlePosition);
        this.eventEmitter.emitEventListener('update');
    }

    #checkBorders(player, delta) {
        //return (player.x + delta) > this.#settings.gridSize.width;
        const newPosition = player.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        if (newPosition.x > this.#settings.gridSize.width || newPosition.x < 1) {
            return true;
        }
        if (newPosition.y > this.#settings.gridSize.height || newPosition.y < 1) {
            return true;
        }

        return false;
    }

    #checkOtherPlayers(movingPlayer, otherPlayer, delta) {
        const newPosition = movingPlayer.position.clone();
        if (delta.x) newPosition.x += delta.x;
        if (delta.y) newPosition.y += delta.y;

        return otherPlayer.position.equal(newPosition);
    }

    #checkGoogleCatching(player) {
        const newPosition = player.position.clone();

        if (this.#google.position.equal(newPosition)) {
            clearInterval(this.#googleMovingIntervalId);
            this.#score[player.playerNumber].points += 1;
            if (this.#score[player.playerNumber].points === this.#settings.pointsToWin) {
                this.#finishGame().then(() => {
                    alert(`Player #${player.playerNumber} win`)
                });
            }
            this.#moveGoogle();
            this.#runMovingGoogleInterval();
        }
    }

    #movePlayer(player, otherPlayer, delta) {
        const isBorder = this.#checkBorders(player, delta);
        if (isBorder) return;
        const isOther = this.#checkOtherPlayers(player, otherPlayer, delta);
        if (isOther) return;

        if (typeof delta.x === 'number' && (delta.x === 1 || delta.x === -1)) {
            player.position.x += delta.x;
        }
        if (typeof delta.y === 'number' && (delta.y === 1 || delta.y === -1)) {
            player.position.y += delta.y;
        }

        this.#checkGoogleCatching(player, delta);


        this.eventEmitter.emitEventListener('update');
    }

    movePlayer1Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer1Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player1, this.#player2, delta);
    }

    movePlayer2Right() {
        const delta = {x: 1}
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Left() {
        const delta = {x: -1}
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Up() {
        const delta = {y: -1}
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    movePlayer2Down() {
        const delta = {y: 1}
        this.#movePlayer(this.#player2, this.#player1, delta);
    }

    get settings() {
        return this.#settings
    }

    set settings(newSettings) {
        this.#settings = newSettings;
    }

    get status() {
        return this.#status;
    }

    set status(newStatus) {
        this.#status = newStatus;
    }

    get player1() {
        return this.#player1;
    }

    get player2() {
        return this.#player2;
    }

    get google() {
        return this.#google;
    }

    get score() {
        return this.#score;
    }
}

class Unit {
    constructor(position) {
        this.position = position;
    }
}

class Player extends Unit {
    constructor(position, playerNumber) {
        super(position);
        this.playerNumber = playerNumber
    }
}

class Google extends Unit {
    constructor(position) {
        super(position);
    }
}

class Position {
    constructor(obj) {
        this.x = obj.x;
        this.y = obj.y;
    }

    clone() {
        return new Position({x: this.x, y: this.y});
    }

    equal(otherPosition) {
        return (otherPosition.x === this.x && otherPosition.y === this.y);
    }

    static getNotCrossedPosition(coordinates, maxX, maxY,) {
        let x, y;

        do {
            x = NumberUtils.getRandomNumber(maxX);
            y = NumberUtils.getRandomNumber(maxY);
        } while (coordinates.some((el) => el.x === x && el.y === y))

        return {x, y};
    }
}

class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(1 + Math.random() * max)
    }
}

// module.exports = {
//     Game
// }