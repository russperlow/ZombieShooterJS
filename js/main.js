import {mapInitialization, drawMap} from './map.js';
import {createPlayer, createZombie, createBullet} from './classes.js'

export {init, PLAYER_SPEED, ZOMBIE_SPEED, BULLET_SPEED};

const canvas = document.querySelector("canvas"); 
const ctx = canvas.getContext("2d");
const screenWidth = 1000;
const screenHeight = 1000;
const PLAYER_SPEED = 2;
const ZOMBIE_SPEED = 2;
const BULLET_SPEED = 2.5;
const ZOMBIE_SPAWN_SPEED = 0.5;
const ZOMBIE_COLOR = "red";

let map = [];
let rect = {left:0, top:0, width:25, height:25};
let player = createPlayer("blue", rect, 500, 500);
let zombies = []; //createZombie("red", rect, 0, 0);
let bullets = [];
let mouseX = 0;
let mouseY = 0;
let zombieSpawnTimer = 0;
let paused = false;

function init(){
    map = mapInitialization();
    let zombie = createZombie(ZOMBIE_COLOR, rect, 0, 0);
    zombies = zombies.concat(zombie);
    loop();
}

document.addEventListener('keydown', function(event){
    switch(event.code){
        case 'KeyA':
            player.move(mouseX, mouseY, {x:1, y:-1});
            break;
        case 'KeyD':
            player.move(mouseX, mouseY, {x:-1, y:1});
            break;
        case 'KeyW':
            player.move(mouseX, mouseY, {x:1, y:1});
            break;
        case 'KeyS':
            player.move(mouseX, mouseY, {x:-1, y:-1});
            break;
        case 'KeyP':
            paused = !paused;
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

    if(!paused){
        gamePlayingLoop();
    }
    
}

function gamePlayingLoop(){
    if(zombieSpawnTimer >= ZOMBIE_SPAWN_SPEED){
        let zx = Math.random() * screenWidth;
        let zy = Math.random() * screenHeight;
        zx = zx < screenWidth / 2 ? zx - screenWidth / 2 : zx + screenWidth / 2;
        zy = zy < screenHeight / 2 ? zy - screenWidth / 2 : zy + screenWidth / 2;

        let zombie = createZombie(ZOMBIE_COLOR, rect, zx, zy);
        zombies.push(zombie);
        zombieSpawnTimer = 0;
        console.log("Zombie Created");
    }
    else{
        zombieSpawnTimer += 0.01;
    }

    // Clear Screen
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    // Draw map/background
    drawMap(ctx, map);    
    
    // Draw bullets
    for(let i = 0; i < bullets.length; i++){
        bullets[i].move();
        bullets[i].draw(ctx);
    }

    // Draw zombies
    for(let i = 0; i < zombies.length; i++){
        zombies[i].move(player.x, player.y);
        zombies[i].draw(ctx, player.x, player.y);
    }

    // Check collision among zombies, bullets and player
    collisionCheck();

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
                console.log("DELETED ZOMBIE");
                j--;
                continue;
            }
        }
    }
}