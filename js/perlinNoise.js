export {perlinNoise};

// Perlin Noise required fields
let perlinInitalized = false;
let p = [];

// Hash lookup table as defined by Ken Perlin. Randomly arranged array from 0-255
let permutation = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180
];

let F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
let G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
let F3 = 1.0 / 3.0;
let G3 = 1.0 / 6.0;
let F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
let G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

function perlinNoise(x = 0, y = 0, z = 0){
    
    // Make sure the p array is initalized
    if(!perlinInitalized){
        for(let i = 0; i < 512; i++){
            p[i] = permutation[i % 256];
        }
        perlinInitalized = true;
    }    

    // Calculate the "unit square" that the point asked will be located in
    let xi = x & 255;
    let yi = y & 255;
    let zi = z & 255;
    let xf = x - Math.round(x);
    let yf = y - Math.round(y);
    let zf = z - Math.round(z);
    let u = fade(xf);
    let v = fade(yf);
    let w = fade(zf);
    console.log("------------------------------------------------");
    console.log("(x, y, z) (" + x + "," + y + "," + z + ")");
    console.log("(xi, yi, zi) (" + xi + "," + yi + "," + zi + ")");
    console.log("(xf, yf, zf) (" + xf + "," + yf + "," + zf + ")");
    console.log("(xr, yr, zr) (" + Math.round(x) + "," + Math.round(y) + "," + Math.round(z) + ")");


    // Perlin's hash function
    let a = p[xi] + yi;
    let aa = p[a] + zi;
    let ab = p[a + 1] + zi;
    let b = p[xi + 1] + yi;
    let ba = p[b] + zi;
    let bb = p[b + 1] + zi;

    // Calculate a new set of p values to get final gradient values
    let x1, x2, y1, y2;
    x1 = lerp(grad(p[aa], xf, yf, zf), grad(p[ba], xf - 1, yf, zf), u);
    x2 = lerp(grad(p[ab], xf, yf, -1, zf), grad(p[bb], xf - 1, yf - 1, zf), u);
    y1 = lerp(x1, x2, v);

    x1 = lerp(grad(p[aa + 1], xf, yf, zf, -1), grad(p[ba + 1], xf - 1, yf, zf - 1), u);
    x2 = lerp(grad(p[ab + 1], xf, yf - 1, zf - 1), grad(p[bb + 1], xf - 1, yf - 1, zf - 1), u);
    y2 = lerp(x1, x2, v);

    // For convienience we bound it to 0 - 1 (theoretical in max before is -1 to 1)
    return (lerp(y1, y2, w) + 1) / 2;

}

function grad(hash = 0, x = 0, y = 0, z = 0){
    switch(hash & 0xF){
        case 0x0: return x + y;
        case 0x1 : return -x + y;
        case 0x2: return x - y;
        case 0x3 : return -x - y;
        case 0x4: return x + z;
        case 0x5 : return -x + z;
        case 0x6: return x - z;
        case 0x7 : return -x - z;
        case 0x8: return y + z;
        case 0x9 : return -y + z;
        case 0xA: return y - z;
        case 0xB : return -y - z;
        case 0xC: return y + x;
        case 0xD : return -y + z;
        case 0xE: return y - x;
        case 0xF : return -y - z;
        default: return 0; // Should never get here
    }
}


// The fade function defined by Perlin eases coordinate values towards integral values - smoothing final output
function fade(t){
    // 6t^5 - 15t^4 + 10t^3
    return t * t * t * (t * (t * 6 - 15) + 10);
}

// Helper method to linerally interpolate between 2 values
function lerp(v0, v1, t){
    return v0 + t * (v1 - v0);
}