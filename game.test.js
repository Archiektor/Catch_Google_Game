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
    it('check on uniq positions', () => {
        for (let i = 0; i < 10; i++) {
            const game = new Game();

            game.settings = {
                gridSize: {
                    width: 2, height: 3,
                }
            }

            game.start()

            const players = game.getPlayers();

            // console.log(`Try #${i}`);
            // console.log(players);

            expect([1, 2]).toContain(players[0].position.x);
            expect([1, 2, 3]).toContain(players[0].position.y);

            expect([1, 2]).toContain(players[1].position.x);
            expect([1, 2, 3]).toContain(players[1].position.y);

            expect(players[0].position.x !== players[1].position.x || players[0].position.y !== players[1].position.y).toBeTruthy();
        }
    })
})