document.body.style.backgroundColor = "#e0e0e0";
document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.justifyContent = "center";
document.body.style.alignItems = "center";
document.body.style.height = "100vh";
document.body.style.margin = "0";

document.body.innerHTML = "<h1 style='font-size: 32px; font-weight: bold; margin-bottom: 10px;'>Detección de colisiones con sonido</h1>" + document.body.innerHTML;

theCanvas = document.getElementById("canvas");
let ctx = theCanvas.getContext("2d");

theCanvas.style.border = "5px solid black";
theCanvas.style.borderRadius = "20px";
theCanvas.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";
theCanvas.style.margin = "20px";

const window_height = 600;
const window_width = 600;

theCanvas.height = window_height;
theCanvas.width = window_width;
theCanvas.style.background = "#ff8";

function getRandomColor() {
    return `rgb(${Math.random() * 256}, ${Math.random() * 256}, ${Math.random() * 256})`;
}

const collisionSound = new Audio("collision.mp3");

class Circle {
    constructor(x, y, radius, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.fillColor = getRandomColor();
        this.dx = (Math.random() > 0.5 ? 1 : -1) * speed;
        this.dy = (Math.random() > 0.5 ? 1 : -1) * speed;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.fillColor;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.strokeStyle = "black";
        context.lineWidth = 2;
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);
        
        if ((this.posX + this.radius) >= window_width) {
            this.posX = window_width - this.radius;
            this.dx = -this.dx;
        }
        if ((this.posX - this.radius) <= 0) {
            this.posX = this.radius;
            this.dx = -this.dx;
        }
        if ((this.posY + this.radius) >= window_height) {
            this.posY = window_height - this.radius;
            this.dy = -this.dy;
        }
        if ((this.posY - this.radius) <= 0) {
            this.posY = this.radius;
            this.dy = -this.dy;
        }
        
        this.posX += this.dx;
        this.posY += this.dy;
    }
}

function detectCollisions(circles) {
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            let dx = circles[i].posX - circles[j].posX;
            let dy = circles[i].posY - circles[j].posY;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < circles[i].radius + circles[j].radius) {
                let angle = Math.atan2(dy, dx);
                let overlap = (circles[i].radius + circles[j].radius) - distance;
                
                circles[i].posX += Math.cos(angle) * (overlap / 2);
                circles[i].posY += Math.sin(angle) * (overlap / 2);
                circles[j].posX -= Math.cos(angle) * (overlap / 2);
                circles[j].posY -= Math.sin(angle) * (overlap / 2);
                
                let tempDx = circles[i].dx;
                let tempDy = circles[i].dy;
                circles[i].dx = circles[j].dx;
                circles[i].dy = circles[j].dy;
                circles[j].dx = tempDx;
                circles[j].dy = tempDy;
                
                circles[i].fillColor = getRandomColor();
                circles[j].fillColor = getRandomColor();
                
                collisionSound.cloneNode(true).play();
            }
        }
    }
}

let circles = [];
let numCircles = 10;
function generateCircles() {
    circles = [];
    for (let i = 0; i < numCircles; i++) {
        let radius = Math.floor(Math.random() * 30) + 20;
        let x = Math.random() * (window_width - 2 * radius) + radius;
        let y = Math.random() * (window_height - 2 * radius) + radius;
        let speed = 3;
        circles.push(new Circle(x, y, radius, speed));
    }
}

generateCircles();

let animationRunning = true;
function updateCircles() {
    if (animationRunning) {
        requestAnimationFrame(updateCircles);
        ctx.clearRect(0, 0, window_width, window_height);
        detectCollisions(circles);
        circles.forEach(circle => circle.update(ctx));
    }
}

updateCircles();

const controls = document.createElement("div");
controls.style.display = "flex";
controls.style.alignItems = "center";
controls.style.marginTop = "10px";

document.body.appendChild(controls);

const input = document.createElement("input");
input.type = "number";
input.value = numCircles;
input.style.marginLeft = "10px";
input.style.padding = "10px";
input.style.fontSize = "18px";
input.style.width = "80px";
input.onchange = () => {
    numCircles = parseInt(input.value) || 10;
    generateCircles();
};

const button = document.createElement("button");
button.innerHTML = "⏸";
button.style.padding = "15px";
button.style.fontSize = "24px";
button.style.cursor = "pointer";
button.style.border = "none";
button.style.borderRadius = "50%";
button.style.background = "#333";
button.style.color = "white";
button.style.width = "100px";
button.style.height = "100px";
button.style.display = "flex";
button.style.justifyContent = "center";
button.style.alignItems = "center";
button.onclick = () => {
    animationRunning = !animationRunning;
    button.innerHTML = animationRunning ? "⏸" : "▶";
    if (animationRunning) {
        updateCircles();
    }
};

controls.appendChild(button);
controls.appendChild(input);
