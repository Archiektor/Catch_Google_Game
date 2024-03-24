class Game {
    #settings = {
        gridSize: {
            width: 4, height: 5,
        },
        googleJumpInterval: 2000,
    };
    #status = 'pending';
    #player1;
    #player2;
    #google;

    constructor() {
    }

    async start() {
        if (this.#status === 'pending') {
            this.#status = 'in-process';

            this.#createUnits();

            setInterval(() => {
                const googlePosition = new Position(Position.getNotCrossedPosition(
                    [this.#player1.position, this.#player2.position, this.#google.position],
                    this.#settings.gridSize.width,
                    this.#settings.gridSize.height,
                ));
                this.#google = new Google(googlePosition);
            }, this.#settings.googleJumpInterval)
        }
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

    get google() {
        return this.#google;
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

module.exports = {
    Game
}