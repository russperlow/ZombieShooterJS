import {mapInitialization, updateMapX, updateMapY, drawMap} from './map.js';
import {createPlayer, createZombie, createBullet} from './classes.js'

export {init, PLAYER_SPEED, ZOMBIE_SPEED, BULLET_SPEED};

const canvas = document.querySelector("canvas"); 
const ctx = canvas.getContext("2d");
let screenWidth = 900;
let screenHeight = 900;
const PLAYER_SPEED = 4;
const ZOMBIE_SPEED = 1;
const BULLET_SPEED = 5;
const ZOMBIE_SPAWN_SPEED = 5;//0.5;
const ZOMBIE_COLOR = "red";

let map = [];
let rect = {left:0, top:0, width:25, height:25};
let player;
let bullets = [];
let zombies = [];
let mouseX = 0;
let mouseY = 0;
let zombieSpawnTimer;
let mainMenu = true, gamePlaying = false, paused = false, gameOver = false;
let score;
let mapMoveX, mapMoveY; // Used as offsets for when the map moves

function init(){

    // Init all changed variables for first and every new game
    score = 0;
    zombies = [];
    bullets = [];
    mapMoveX = 0;
    mapMoveY = 0;
    zombieSpawnTimer = 0;
    
    canvas.width = screenWidth = window.innerWidth;// * 0.8;
    canvas.height = screenHeight = window.innerHeight;// * 0.8;
    map = mapInitialization(0, 0, screenWidth / 25, screenHeight / 25);

    player = createPlayer("purple", rect, 500, 500);
    
    let zombie = createZombie(ZOMBIE_COLOR, rect, 0, 0);
    zombies = zombies.concat(zombie);
    
    ctx.fillStyle = "green";
    ctx.fillRect(0, 0, screenWidth, screenHeight);
}

window.onload = window.onresize = function(){
    canvas.width = screenWidth = window.innerWidth;// * 0.8;
    canvas.height = screenHeight = window.innerHeight;// * 0.8;

    // Main menu - draw background, game playing - pause the game
    if(mainMenu){
        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, screenWidth, screenHeight);
    }
    else if(!paused){
        paused = true;
    }
}

document.addEventListener('keydown', function(event){
    // console.log(event.code);
    switch(event.code){
        case 'KeyA': // Move left
            if(!paused)
                player.move(mouseX, mouseY, {x:1, y:-1});
            break;
        case 'KeyD': // Move right
            if(!paused)
                player.move(mouseX, mouseY, {x:-1, y:1});
            break;
        case 'KeyW': // Move up
            if(!paused)
                player.move(mouseX, mouseY, {x:1, y:1});
            break;
        case 'KeyS': // Move down
            if(!paused)
                player.move(mouseX, mouseY, {x:-1, y:-1});
            break;
        case 'Escape': // Pause game
            paused = !paused;
            if(!paused)
                document.querySelector("#pausedMenu").style.display = "none";
            else
                document.querySelector("#pausedMenu").style.display = "inline";
            break;
        case 'Enter': // Start game / restart game
            if(mainMenu){
                mainMenu = false;
                gamePlaying = true;
                document.querySelector("#mainMenu").style.display = "none";
                document.querySelector("#score").style.display = "inline";
                loop();
            }
            else if(gameOver){
                gameOver = false;
                gamePlaying = true;
                document.querySelector("#gameOver").style.display = "none";
                init();
                loop();
            }
            break;
    }
});

document.addEventListener('click', function(event){
    var bullet = createBullet("black", player.x, player.y, mouseX, mouseY, {left:0, top:0, width:5, height:5});
    bullets = bullets.concat(bullet);
});

document.addEventListener('mousemove', function(event){
    mouseX = event.clientX - canvas.getBoundingClientRect().left;
    mouseY = event.clientY - canvas.getBoundingClientRect().top;
});

function loop(){
    requestAnimationFrame(loop);

    if(gamePlaying && !paused){
        gamePlayingUpdate();
        gamePlayingDraw();
    }
    else if(paused){
        gamePlayingDraw();
    }
    else if(gameOver){
        document.querySelector("#gameOver").style.display = "inline";
        window.cancelAnimationFrame(loop);
    }
}

function gamePlayingUpdate(){
    // if(zombieSpawnTimer >= ZOMBIE_SPAWN_SPEED){
    //     let zx = Math.random() * screenWidth;
    //     let zy = Math.random() * screenHeight;
    //     zx = zx < screenWidth / 2 ? zx - screenWidth / 2 : zx * mapMoveX + screenWidth / 2;
    //     zy = zy < screenHeight / 2 ? zy - screenWidth / 2 : zy * mapMoveY + screenWidth / 2;

    //     let zombie = createZombie(ZOMBIE_COLOR, rect, zx, zy);
    //     zombies.push(zombie);
    //     zombieSpawnTimer = 0;
    //     // console.log("Zombie Created");
    // }
    // else{
    //     zombieSpawnTimer += 0.01;
    // }

    // Move bullets
    for(let i = 0; i < bullets.length; i++){
        bullets[i].move();
    }

    // Move zombies
    for(let i = 0; i < zombies.length; i++){
        zombies[i].move(player.x, player.y);
    }

    // Check collision among zombies, bullets and player
    collisionCheck();
}

function gamePlayingDraw(){
    // Clear Screen
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Draw map/background
    drawMap(ctx, map);    
    
    // Draw bullets
    for(let i = 0; i < bullets.length; i++){
        bullets[i].draw(ctx);
    }

    // Draw zombies
    for(let i = 0; i < zombies.length; i++){
        zombies[i].draw(ctx, player.x, player.y);
    }

    // Lastly, draw player
    player.draw(ctx, mouseX, mouseY);
}

function collisionCheck(){

    // Check all bullets potential collisions
    for(let i = 0; i < bullets.length; i++){
        let bullet = bullets[i];
        
        // If the bullet is off the screen, delete it
        if(bullet.x < 0 || bullet.x > screenWidth || bullet.y < 0 || bullet.y > screenHeight){
            let index = bullets.indexOf(bullet);
            bullets.splice(i, 1);
            console.log("DELETED BULLET");
            i--;
            continue;
        }

        // See if bullet has collided with a zombie
        for(let j = 0; j < zombies.length; j++){
            let zombie = zombies[j];
            if(bullet.x < zombie.x + zombie.rect.width && 
                bullet.x + bullet.rect.width > zombie.x &&
                bullet.y < zombie.y + zombie.rect.height &&
                bullet.y + bullet.rect.height > zombie.y
            ){
                zombies.splice(j, 1);
                // console.log("DELETED ZOMBIE");
                j--;
                document.querySelector("#score").textContent = "Score: " + (++score);
                continue;
            }
        }
    }

    // Check if zombies collide with player
    for(let i = 0; i < zombies.length; i++){
        let zombie = zombies[i];
        if(player.x < zombie.x + zombie.rect.width && 
            player.x + player.rect.width > zombie.x &&
            player.y < zombie.y + zombie.rect.height &&
            player.y + player.rect.height > zombie.y
        ){
            gamePlaying = false;
            gameOver = true;
        }
    }

    // Check if the map needs to move side to side
    if(player.x < player.rect.width){
        player.x = player.rect.width;    
        mapMoveX--;
        map = updateMapX(map, false, mapMoveX)    
    }
    else if(player.x > screenWidth - player.rect.width * 2){
        player.x = screenWidth - player.rect.width * 2;
        mapMoveX++;
        map = updateMapX(map, true, mapMoveX);
    }

    // Check if the map needs to move up/down
    if(player.y < player.rect.height){
        player.y = player.rect.height;
        mapMoveY--;
        map = updateMapY(map, false, mapMoveY)    
    }
    else if(player.y > screenHeight - player.rect.height * 2){
        player.y = screenHeight - player.rect.height * 2;
        mapMoveY++;
        map = updateMapY(map, true, mapMoveY);
    }
}