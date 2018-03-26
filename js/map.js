import {perlinNoise} from './perlinNoise.js';
export {mapInitialization, updateMapX, updateMapY, drawMap};

const seed = generateSeed();
const tileSize = 25;

function generateSeed(){
    return Math.random() * (51197) % 20;
}

function mapInitialization(startX = 0, startY = 0, rows = 100, columns = 100){
    let map = [];
    rows = Math.round(rows);
    columns = Math.round(columns);
    
    for(let i = startX; i < rows; i++){
        map[i] = [];
        for(let j = startY; j < columns; j++){
            let n = (i * 2 * j * 3) * seed % 256;
            let noise = Math.abs(perlinNoise(n));
            let image = new Image();
            if(noise <= 0.15){
                image.src = "images/Water.png";
            }
            else if(noise >= 0.85 && noise < 1){
                image.src = "images/Stone.png";
            }
            else{
                image.src = "images/Grass.png";
            }
            map[i][j] = image;
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

    return pos;
}

function updateMapX(map, movePositive, xChange){
    if(movePositive){
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[j].length; j++){
                if(i == map.length - 1){
                    let noise = Math.abs(perlinNoise(((i + xChange) * 2 * j * 3) * seed % 256));
                    let image = new Image();
                    if(noise < 0.05){
                        image.src = "images/Water.png";
                    }
                    else if(noise < 0.95){
                        image.src = "images/Grass.png";
                    }
                    else{
                        image.src = "images/Stone.png";
                    }
                    map[i][j] = image;
                }
                else{
                    map[i][j] = map[i+1][j];
                }
            }
        }
    }
    else{
        for(let i = map.length - 1; i >= 0; i--){
            for(let j = 0; j < map[j].length; j++){
                if(i == 0){
                    let noise = Math.abs(perlinNoise(((i + xChange) * 2 * j * 3) * seed % 256));
                    let image = new Image();
                    if(noise < 0.05){
                        image.src = "images/Water.png";
                    }
                    else if(noise < 0.95){
                        image.src = "images/Grass.png";
                    }
                    else{
                        image.src = "images/Stone.png";
                    }
                }
                else{
                    map[i][j] = map[i-1][j];
                }
            }
        }
    }
    return map;
}

function updateMapY(map, movePositive, yChange){
    if(movePositive){
        for(let i = 0; i < map.length; i++){
            for(let j = 0; j < map[j].length; j++){
                if(j == map[j].length - 1){
                    let noise = Math.abs(perlinNoise((i * 2 * (j + yChange) * 3) * seed % 256));
                    let image = new Image();
                    if(noise < 0.05){
                        image.src = "images/Water.png";
                    }
                    else if(noise < 0.95){
                        image.src = "images/Grass.png";
                    }
                    else{
                        image.src = "images/Stone.png";
                    }
                }
                else{
                    map[i][j] = map[i][j+1];
                }
            }
        }
    }
    else{
        for(let i = 0; i < map.length; i++){
            for(let j = map[i].length - 1; j >= 0; j--){
                if(j == 0){
                    let noise = Math.abs(perlinNoise((i * 2 * (j + yChange) * 3) * seed % 256));
                    let image = new Image();
                    if(noise < 0.05){
                        image.src = "images/Water.png";
                    }
                    else if(noise < 0.95){
                        image.src = "images/Grass.png";
                    }
                    else{
                        image.src = "images/Stone.png";
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
            ctx.drawImage(map[x][y], x * tileSize, y * tileSize, tileSize, tileSize);
        }
    }
}