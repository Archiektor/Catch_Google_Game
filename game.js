class Game {
    #settings = {
        gridSize: {
            width: 4, height: 5,
        }
    };
    #status = 'pending';
    #player1;
    #player2;
    #google;

    #createUnits() {
        const player1Position = Position.getNotCrossedPosition(
            this.#settings.gridSize.width,
            this.#settings.gridSize.height,
            [])
        this.#player1 = new Player(player1Position, 1);
        //const player2Position = new Position(this.getRandomPosition([player1Position]));
        const player2Position = Position.getNotCrossedPosition(
            this.#settings.gridSize.width,
            this.#settings.gridSize.height,
            [player1Position])
        this.#player2 = new Player(player2Position, 2);

        const googlePosition = Position.getNotCrossedPosition(
            this.#settings.gridSize.width,
            this.#settings.gridSize.height,
            [player1Position, player2Position]);
        this.#google = new Google(googlePosition);
    }

    // getRandomPosition(coordinates) {
    //     let x, y;
    //
    //     do {
    //         x = NumberUtils.getRandomNumber(this.#settings.gridSize.width);
    //         y = NumberUtils.getRandomNumber(this.#settings.gridSize.height);
    //     } while (coordinates.some((el) => el.x === x && el.y === y))
    //
    //     return {x, y};
    // }

    getGoogle() {
        return this.#google;
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

    get player1() {
        return this.#player1;
    }

    get player2() {
        return this.#player2;
    }

    start() {
        if (this.#status === 'pending') {
            this.#status = 'in-process';

            this.#createUnits();
        }
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

    static getNotCrossedPosition(maxX, maxY, coordinates) {
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

module.exports = {
    Game
}