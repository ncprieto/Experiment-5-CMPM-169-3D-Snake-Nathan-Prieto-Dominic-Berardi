let cubeArray = [];
let currSteps;
let stepCount;
let stepInterval;

function preload(){
    moveSound = loadSound('blipSelect.wav');
    dieSound = loadSound('explosion.wav');
}

function setup() {
    createCanvas(windowWidth,windowHeight, WEBGL);
    colorMode(RGB, 255, 255, 255);
    stroke('black');
    strokeWeight(10);
    lights();
    let fov = PI/3; 
    let cameraZ = (height/2.0) / tan(fov/2.0);
    perspective(fov, width/height, cameraZ/10.0, cameraZ*10.0);
    currSteps = 0;
    stepCount = Math.floor(random(2, 6));
    stepInterval = 1000;
    cubeArray.push(new Cube(createVector(0, 0, 0), "none"));
    moveSound.setVolume(.25);
    dieSound.setVolume(.55);
}

function draw(){
    orbitControl();
    background('#B6DF06');
    stroke('black');
    strokeWeight(5);
    noFill();
    box(2100, 2100, 2100);
    fill('#5c821b');
    cubeArray[cubeArray.length - 1].newCube();
    cubeArray[cubeArray.length - 1].draw();
    let resetSnake = false;
    for(let i = 0; i < cubeArray.length - 1; i++){
        cubeArray[i].draw();
        if(cubeArray[cubeArray.length - 1].origin.equals(cubeArray[i].origin)){
            dieSound.play();
            resetSnake = true;
            break;
        }
    }
    if (resetSnake){
        background(0);
        stepInterval = 1000;
        cubeArray = [new Cube(createVector(0, 0, 0), "none")];
    }
}

class Cube{
    constructor(origin, face){
        this.origin = origin;
        this.time = 0;
        this.cameFrom = face;
        this.possible = ["front", "back", "left", "right", "top", "bottom"];
        let index = this.possible.findIndex((element) => element == this.OppositeFace(face));
        if(index != -1){
            this.possible.splice(index, 1);
        }
        moveSound.play();
    }

    draw(){
        push();
        translate(this.origin.x, this.origin.y, this.origin.z);
        box(100, 100, 100);
        pop();
    }

    newCube(){
        this.time += deltaTime;
        stepInterval *= 0.9995; 
        if ((this.time >= stepInterval)){
            this.time = 0;
            currSteps++;
            let face = this.cameFrom;
            if (stepCount <= currSteps){
                this.CheckBounds();
                let index = Math.floor(random(0, this.possible.length));
                face  = this.possible[index];
                currSteps = 0;
                stepCount = Math.floor(random(2, 6));
            }
            this.CreateCubeWithFace(face);
        }
    }

    CreateCubeWithFace(face){
        // spawn new cube
        switch(face){
            //increase x
            case "right":
                cubeArray.push(new Cube(createVector(this.origin.x + 100, this.origin.y, this.origin.z), "right"));
                break;
            //decrease x
            case "left":
                cubeArray.push(new Cube(createVector(this.origin.x - 100, this.origin.y, this.origin.z), "left"));
                break;
            //increase y
            case "bottom":
                cubeArray.push(new Cube(createVector(this.origin.x, this.origin.y + 100, this.origin.z), "bottom"));
                break;
            //decrease y
            case "top":
                cubeArray.push(new Cube(createVector(this.origin.x, this.origin.y - 100, this.origin.z), "top"));
                break;
            //increase z
            case "front":
                cubeArray.push(new Cube(createVector(this.origin.x, this.origin.y, this.origin.z + 100), "front"));
                break;
            //decrease z
            case "back":
                cubeArray.push(new Cube(createVector(this.origin.x, this.origin.y, this.origin.z - 100), "back"));
                break;
        }
    }

    OppositeFace(face){
        switch(face){
            case "top":
                return "bottom";
            case "bottom":
                return "top";
            case "front":
                return "back";
            case "back":
                return "front";
            case "left":
                return "right";
            case "right":
                return "left";
        }
    }

    CheckBounds(){
        if(this.IsOnTopEdge()){
            let index = this.possible.findIndex((element) => element == "top");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
        if(this.IsOnBottomEdge()){
            let index = this.possible.findIndex((element) => element == "bottom");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
        if(this.IsOnRightEdge()){
            let index = this.possible.findIndex((element) => element == "right");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
        if(this.IsOnLeftEdge()){
            let index = this.possible.findIndex((element) => element == "left");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
        if(this.IsOnFrontEdge()){
            let index = this.possible.findIndex((element) => element == "front");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
        if(this.IsOnBackEdge()){
            let index = this.possible.findIndex((element) => element == "back");
            if(index != -1){
                this.possible.splice(index, 1);
            }
        }
    }

    IsOnTopEdge(){
        if(this.origin.y - 100 <= -800){
            return true;
        }
        return false;
    }

    IsOnBottomEdge(){
        if(this.origin.y + 100 >= 800){
            return true;
        }
        return false;
    }

    IsOnRightEdge(){
        if(this.origin.x  + 100 >= 800){
            return true;
        }
        return false;
    }

    IsOnLeftEdge(){
        if(this.origin.x - 100 <= -800){
            return true;
        }
        return false;
    }

    IsOnFrontEdge(){
        if(this.origin.z + 100 >= 800){
            return true;
        }
        return false;
    }

    IsOnBackEdge(){
        if(this.origin.z - 100 <= -800){
            return true;
        }
        return false;
    }
}
