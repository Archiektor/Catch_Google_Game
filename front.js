import {Game} from './game.js';
import {Observable} from './utils/'

const game = new Game();

const insertImg = (pathToImg, whereToInsert) => {
    const img = document.createElement('img');
    img.src = pathToImg;
    whereToInsert.append(img);
}

// console.log(game);

const start = async () => {
    await game.start();
    const render = () => {
        const table = document.createElement('table');
        table.classList.add('dynamic-table');

        document.body.append(table);

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
    render();
}

start();

