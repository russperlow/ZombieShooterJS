import {perlinNoise} from './perlinNoise.js';
export {mapInitialization, drawMap};

const seed = generateSeed();

function generateSeed(){
    return Math.random() * (51197) % 20;
}

function mapInitialization(rows = 100, columns = 100){
    let map = [];
    console.log("UPDATED");
    for(let i = 0; i < rows; i++){
        map[i] = [];
        for(let j = 0; j < columns; j++){
            let noise = perlinNoise(i, j, 0);//getSeededPosition(i, j);
            // console.log("Noise: " + noise);
            if(noise < 0.5){
                map[i][j] = 0;
            }
            else if(noise < 0.6){
                map[i][j] = 1;
            }
            else{
                map[i][j] = 2;
            }
            // console.log("Map[" + i + "][" + j + "] = " + map[i][j]); 
        }
    }
    return map;
}

function getSeededPosition(x = 0, y = 0){
    let pos = Math.round(((x*5) + (y*11) + (seed * 97)) % 3);
    pos = (seed * 9301 + 49297) % 233280;
    pos = seed / 233280;
    pos = x + pos * (y - x);
    if(pos < 0){
        pos *= -1;
    }

    console.log("X: " + x + " Y: " + y + " Seed: " + seed + " Pos: " + pos);
    return pos;
}

function drawMap(ctx, map){
    let color = 'red';
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            switch(map[x][y]){
                case 0:
                    color = 'red';
                    break;
                case 1:
                    color = 'green';
                    break;
                case 2:
                    color = 'blue';
                    break;
            }
            ctx.fillStyle = color;
            ctx.fillRect(x * 10, y * 10, 10, 10);
        }
    }
}