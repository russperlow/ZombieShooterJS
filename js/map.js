import {perlinNoise} from './perlinNoise.js';
export {mapInitialization, updateMap, drawMap};

const seed = 5.393906695411715;// generateSeed();
const tileSize = 25;

function generateSeed(){
    return Math.random() * (51197) % 20;
}

function mapInitialization(startX = 0, startY = 0, rows = 100, columns = 100){
    let map = [];
    rows = Math.round(rows);
    columns = Math.round(columns);

    console.log("startX: " + startX + " StartY: " + startY + " Rows: " + rows + " Columns " + columns + " Seed: " + seed);
    
    for(let i = startX; i < rows; i++){
        map[i] = [];
        for(let j = startY; j < columns; j++){
            // let x = (i - 1 * seed % 256 + i * seed % 256 + i + 1 * seed % 256) / 3;
            // let y = (j - 1 * seed % 256 + j * seed % 256 + j + 1 * seed % 256) / 3;
            let n = (i * 2 * j * 3) * seed % 256;
            // console.log("n: " + n);
            let noise = Math.abs(perlinNoise(n));
            // let noise = perlinNoise(x, y, 0);
            // let noise = perlinNoise(i * seed % 256, j * seed % 256, 0);//getSeededPosition(i, j);
            // console.log("Noise: " + noise);
            if(noise < 0.05){
                map[i][j] = 0;
            }
            else if(noise < 0.95){
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

function updateMap(map, xChange, yChange){
    if(xChange > 0){
        console.log("X change positive");
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[j].length; j++){
                if(i == map[i].length - 1){
                    let noise = Math.abs(perlinNoise((i + xChange * 2 * j * 3) * seed % 256));
                    if(noise < 0.05){
                        map[i][j] = 0;
                    }
                    else if(noise < 0.95){
                        map[i][j] = 1;
                    }
                    else{
                        map[i][j] = 2;
                    }
                }
                else{
                    map[i][j] = map[i+1][j];
                }
            }
        }
    }
    else if(xChange < 0){
        console.log("X change negative");
        for(let i = map.length; i > 0; i--){
            for(let j = 0; j < map[j].length; j++){
                if(i == 0){
                    let noise = Math.abs(perlinNoise((i + xChange * 2 * j * 3) * seed % 256));
                    if(noise < 0.05){
                        map[i][j] = 0;
                    }
                    else if(noise < 0.95){
                        map[i][j] = 1;
                    }
                    else{
                        map[i][j] = 2;
                    }
                }
                else{
                    map[i][j] = map[i-1][j];
                }
            }
        }
    }

    if(yChange > 0){
        console.log("Y change positive");
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[j].length; j++){
                if(j == map[j].length - 1){
                    let noise = Math.abs(perlinNoise((i * 2 * j + yChange * 3) * seed % 256));
                    if(noise < 0.05){
                        map[i][j] = 0;
                    }
                    else if(noise < 0.95){
                        map[i][j] = 1;
                    }
                    else{
                        map[i][j] = 2;
                    }
                }
                else{
                    map[i][j] = map[i][j+1];
                }
            }
        }
    }
    else if(yChange < 0){
        console.log("Y change negative");
        for(let i = 0; i < map.length; i++){
            for(let j = map[j].length - 1; j > 0; j--){
                if(j == 0){
                    let noise = Math.abs(perlinNoise((i * 2 * j + yChange * 3) * seed % 256));
                    if(noise < 0.05){
                        map[i][j] = 0;
                    }
                    else if(noise < 0.95){
                        map[i][j] = 1;
                    }
                    else{
                        map[i][j] = 2;
                    }
                }
                else{
                    map[i][j] = map[i][j-1];
                }
            }
        }
    }

    return map;
}

function drawMap(ctx, map){
    let color = 'red';
    for(let x = 0; x < map.length; x++){
        for(let y = 0; y < map[x].length; y++){
            switch(map[x][y]){
                case 0:
                    color = 'rgba(0, 123, 153, 1)'; // Water
                    break;
                case 1:
                    color = 'rgba(11, 102, 35, 1)'; // Grass
                    break;
                case 2:
                    color = 'rgba(112, 128, 144, 1)'; // Stone
                    break;
            }
            ctx.fillStyle = color;
            ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}