import {Game} from './game.js';
import {EventEmitter} from './utils/EventEmitter.js'


const insertImg = (pathToImg, whereToInsert) => {
    const img = document.createElement('img');
    img.src = pathToImg;
    whereToInsert.append(img);
}

// console.log(game);

const start = async () => {
    const eventEmitter = new EventEmitter();
    const game = new Game(eventEmitter);

    const table = document.createElement('table');
    const result = document.querySelector('#result');

    document.body.append(table);
    const render = () => {
        table.innerHTML = "";
        result.innerHTML = "";

        result.append(`Player #1 score: ${game.score[1].points} - Player #2 score: ${game.score[2].points}`);

        for (let y = 1; y <= game.settings.gridSize.height; y++) {
            const tr = document.createElement('tr');

            for (let x = 1; x <= game.settings.gridSize.width; x++) {
                const td = document.createElement('td');

                const player1 = game.player1;
                const player2 = game.player2;
                const google = game.google;

                if (player1.position.x === x && player1.position.y === y) {
                    insertImg('assets/shoot.png', td);
                }
                if (player2.position.x === x && player2.position.y === y) {
                    insertImg('assets/soccer-player.png', td);
                }
                if (google.position.x === x && google.position.y === y) {
                    insertImg('assets/logo.png', td);
                }

                tr.append(td);
            }
            table.append(tr);
        }
    }

    game.eventEmitter.addEventListener('update', () => {
        render();
    });
    // render();

    await game.start();

    window.addEventListener('keydown', (event) => {
        switch (event.code) {
            case 'ArrowUp': {
                game.movePlayer1Up();
                break;
            }
            case 'ArrowDown': {
                game.movePlayer1Down();
                break;
            }
            case 'ArrowLeft': {
                game.movePlayer1Left();
                break;
            }
            case 'ArrowRight': {
                game.movePlayer1Right();
                break;
            }
            case 'KeyW': {
                game.movePlayer2Up();
                break;
            }
            case 'KeyS': {
                game.movePlayer2Down();
                break;
            }
            case 'KeyA': {
                game.movePlayer2Left();
                break;
            }
            case 'KeyD': {
                game.movePlayer2Right();
                break;
            }
        }
    })
}

start();

