export {normalize};

function normalize(x1=0, y1=0, x2=0, y2=0){
    let vectX = x1 - x2;
    let vectY = y1 - y2;
    let length = Math.sqrt(vectX * vectX + vectY * vectY);
    let fwdX = vectX / length;
    let fwdY = vectY / length;
    return {vectX, vectY, length, fwdX, fwdY};
}