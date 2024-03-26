const {Game} = require('./game')

describe('game test', () => {
    it('init test', () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                width: 4, height: 5,
            }
        }

        expect(game.settings.gridSize.width).toBe(4);
        expect(game.settings.gridSize.height).toBe(5);
    })
    it('game start', () => {
        const game = new Game();

        game.status = 'pending'
        game.start()

        expect(game.status).toBe('in-process');
    })
    it('check player#1 and player#2 to have unique positions', () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();

            game.settings = {
                gridSize: {
                    width: 1, height: 3,
                }
            }

            game.start()

            const player1 = game.player1;
            const player2 = game.player2;

            expect([1]).toContain(player1.position.x);
            expect([1, 2, 3]).toContain(player1.position.y);

            expect([1]).toContain(player2.position.x);
            expect([1, 2, 3]).toContain(player2.position.y);

            expect(player1.position.x !== player2.position.x || player1.position.y !== player2.position.y).toBeTruthy();
        }
    })

    it('check players and google to have unique positions', () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();

            game.settings = {
                gridSize: {
                    width: 1, height: 3,
                }
            }

            game.start()

            const player1 = game.player1;
            const player2 = game.player2;
            const google = game.google;

            // console.log(`Try #${i}`);
            // console.log(player1);
            // console.log(player2);
            // console.log(google);

            expect([1]).toContain(player1.position.x);
            expect([1, 2, 3]).toContain(player1.position.y);

            expect([1]).toContain(player2.position.x);
            expect([1, 2, 3]).toContain(player2.position.y);

            expect([1]).toContain(google.position.x);
            expect([1, 2, 3]).toContain(google.position.y);

            expect(
                google.position.x !== player1.position.x ||
                google.position.y !== player2.position.x &&
                google.position.x !== player2.position.y ||
                google.position.y !== player2.position.y).toBeTruthy();
        }
    })

    it('check google position after jump', async () => {
        const game = new Game();

        game.settings = {
            gridSize: {
                width: 1, height: 4,
            },
            googleJumpInterval: 100
        }

        await game.start()

        const prevPosition = game.google.position.clone();

        await delay(150);

        // console.log('prevPosition', prevPosition);
        // console.log('game.google.position', game.google.position);
        // console.log('game.player #1', game.player1.position);
        // console.log('game.player #2', game.player2.position);

        expect(game.google.position.equal(prevPosition)).toBe(false);
    })

    it('catch google by player#1 or player#2 for one row', async () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();

            game.settings = {
                gridSize: {
                    width: 3, height: 1,
                },
                //googleJumpInterval: 100
            }
            await game.start()
            // p1 p2 g | p1 g p2 | p2 p1 g | p2 g p1 | g p1 p2 | g p2 p1

            // console.log('player#1', game.player1.position);
            // console.log('player#2', game.player2.position);
            // console.log('google', game.google.position);
            const prevGooglePosition = game.google.position.clone();

            const deltaForPlayer1 = game.google.position.x - game.player1.position.x;


            if (Math.abs(deltaForPlayer1) === 2) {
                const deltaForPlayer2 = game.google.position.x - game.player2.position.x;
                if (deltaForPlayer2 > 0) {
                    game.movePlayer2Right();
                } else {
                    game.movePlayer2Left();
                }

                expect(game.score[1].points).toBe(0);
                expect(game.score[2].points).toBe(1);
            } else {
                if (deltaForPlayer1 > 0) {
                    game.movePlayer1Right()
                } else {
                    game.movePlayer1Left()
                }

                expect(game.score[1].points).toBe(1);
                expect(game.score[2].points).toBe(0);

                // console.log('score :', game.score);
            }

            // console.log('google, -> ', game.google.position);
            // console.log('prevGooglePosition, -> ', prevGooglePosition);
            expect(game.google.position.equal(prevGooglePosition)).toBe(false);
        }
    })
})

const delay = (ms) => new Promise(res => {
    setTimeout(res, ms);
})
