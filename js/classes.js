import {PLAYER_SPEED, ZOMBIE_SPEED, BULLET_SPEED} from './main.js';
import {normalize} from './utilities.js';
export {createPlayer, createZombie, createBullet};

class Human{
    constructor(color="red", rect={left:0, top:0, width:25, height:25}, x=0, y=0, speed=1){
        this.color = color;
        this.rect = rect;
        this.x = x;
        this.y = y;
        this.speed = speed;
    }

    move(){

    }

    draw(ctx, targetX, targetY){
        let dx = targetX - this.x;
        let dy = targetY - this.y;
        let rotation = Math.atan2(dy, dx);
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(rotation);
        ctx.fillRect(-this.rect.width / 2, -this.rect.height / 2, this.rect.width, this.rect.height);
        ctx.restore();
    }
}

class Player extends Human{
    constructor(color="purple", rect={left:0, top:0, width:25, height:25}, x=0, y=0){
        super(color, rect, x, y, PLAYER_SPEED);
    }

    move(mouseX=0, mouseY=0, keyVect={x:1, y:1}){
        let norm = normalize(mouseX, mouseY, this.x, this.y);
        norm.fwdX *= keyVect.x;
        norm.fwdY *= keyVect.y;
        this.x += norm.fwdX * this.speed;
        this.y += norm.fwdY * this.speed;
    }
}

class Zombie extends Human{
    constructor(color="red", rect={left:0, top:0, width:25, height:25}, x=0, y=0){
        super(color, rect, x, y, ZOMBIE_SPEED);
    }

    move(playerX, playerY){
        let moveX = playerX - this.x;
        let moveY = playerY - this.y;
        let norm = normalize(playerX, playerY, this.x, this.y);
        this.x += norm.fwdX * this.speed;
        this.y += norm.fwdY * this.speed;
    }
}

class Bullet{
    constructor(color="black", rect={left:0, top:0, width:5, height:5}, x=0, y=0, fwd={x:0, y:0}){
        this.color = color;
        this.rect = rect;
        this.x = x;
        this.y = y;
        this.speed = BULLET_SPEED;
        this.fwd = fwd;
    }

    move(){
        this.x += this.fwd.x * this.speed;
        this.y += this.fwd.y * this.speed;
    }

    draw(ctx){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.rect.width / 2, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        // ctx.fillRect(this.x, this.y, this.rect.width, this.rect.height);
    }
}

function createPlayer(color="purple", rect={left:0, top:0, width:25, height:25}, x=0, y=0, speed=2){
    let player = new Player(color, rect, x, y, speed);
    return player;
}

function createZombie(color="red", rect={left:0, top:0, width:25, height:25}, x=0, y=0, speed=1){
    let zombie = new Zombie(color, rect, x, y, speed);
    return zombie;
}

function createBullet(color="black", x=0, y=0, mouseX, mouseY, rect={left:0, top:0, width:5, height:5}){
    let norm = normalize(mouseX, mouseY, x, y);
    let bullet = new Bullet(color, rect, x, y, {x:norm.fwdX, y:norm.fwdY});
    return bullet;
}