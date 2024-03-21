class Game {
    #settings = {
        gridSize: {
            width: 4, height: 5,
        }
    };
    #status = 'pending';
    #player1;
    #player2;

    #createPlayers() {
        const player1Position = new Position({
            x: NumberUtils.getRandomNumber(this.#settings.gridSize.width), y: NumberUtils.getRandomNumber(this.#settings.gridSize.height),
        })
        this.#player1 = new Player(1, player1Position);
        const player2Position = new Position(this.getRandomPosition([player1Position]));
        this.#player2 = new Player(2, player2Position);
    }

    getRandomPosition(coordinates) {
        let x, y;

        do {
            x = NumberUtils.getRandomNumber(this.#settings.gridSize.width);
            y = NumberUtils.getRandomNumber(this.#settings.gridSize.height);
        } while (coordinates.some((el) => el.x === x && el.y === y))

        return {x, y};
    }

    constructor() {

    }

    getPlayers() {
        return [this.#player1, this.#player2];
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

    start() {
        if (this.#status === 'pending') {
            this.#status = 'in-process';

            this.#createPlayers();
        }
    }
}

class Player {
    constructor(playerNumber, position) {
        this.playerNumber = playerNumber;
        this.position = position;
    }
}

class Position {
    constructor(obj) {
        this.x = obj.x;
        this.y = obj.y;
    }
}

class NumberUtils {
    static getRandomNumber(max) {
        return Math.floor(1 + Math.random() * max)
    }
}

module.exports = {
    Game
}