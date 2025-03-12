const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

const window_height = 600;
const window_width = 800;
canvas.height = window_height;
canvas.width = window_width;

// Establecer la imagen de fondo del canvas
const background = new Image();
background.src = "Media/Images/Fondo_Espacio.jpg";
background.onload = drawBackground; // Asegurar que la imagen se cargue antes de dibujarla

function drawBackground() {
    ctx.drawImage(background, 0, 0, window_width, window_height);
}

// Estilización de la página
canvas.style.display = "block";
canvas.style.margin = "auto";
canvas.style.border = "5px solid #fff";
canvas.style.borderRadius = "15px";
canvas.style.boxShadow = "0 0 20px rgba(255, 255, 255, 0.3)";

document.body.style.display = "flex";
document.body.style.flexDirection = "column";
document.body.style.alignItems = "center";
document.body.style.justifyContent = "center";
document.body.style.height = "100vh";
document.body.style.background = "linear-gradient(135deg, #1a1a2e, #16213e)";
document.body.style.fontFamily = "Arial, sans-serif";

document.body.appendChild(canvas);

let level = 1;
let totalCircles = 10;
let removedCircles = 0;
let circles = [];
const levelSize = 10;
let timeLeft = 10;
let timer;
let explosions = [];

const explosionSound = new Audio("Media/Audio/collision.mp3"); // Reemplaza con la ruta de tu sonido

const stats = document.createElement("div");
stats.style.color = "#fff";
stats.style.fontSize = "20px";
stats.style.marginBottom = "10px";
stats.style.padding = "10px";
stats.style.borderRadius = "10px";
stats.style.background = "rgba(0, 0, 0, 0.5)";
stats.style.boxShadow = "0 0 10px rgba(255, 255, 255, 0.2)";
document.body.insertBefore(stats, canvas);

const messageDiv = document.createElement("div");
messageDiv.style.color = "#fff";
messageDiv.style.fontSize = "24px";
messageDiv.style.marginTop = "10px";
messageDiv.style.padding = "10px";
messageDiv.style.borderRadius = "10px";
messageDiv.style.background = "rgba(255, 0, 0, 0.6)";
messageDiv.style.display = "none";
document.body.appendChild(messageDiv);

const retryButton = document.createElement("button");
retryButton.innerText = "Reintentar Nivel";
retryButton.style.display = "none";
retryButton.style.marginTop = "15px";
retryButton.style.padding = "10px 20px";
retryButton.style.border = "none";
retryButton.style.borderRadius = "10px";
retryButton.style.background = "#ff4757";
retryButton.style.color = "#fff";
retryButton.style.fontSize = "18px";
retryButton.style.cursor = "pointer";
retryButton.style.transition = "0.3s";
retryButton.addEventListener("mouseover", () => retryButton.style.background = "#e84118");
retryButton.addEventListener("mouseout", () => retryButton.style.background = "#ff4757");
document.body.appendChild(retryButton);

retryButton.addEventListener("click", () => {
    level = 1;
    spawnCircles();
    retryButton.style.display = "none";
    messageDiv.style.display = "none";
});

class Circle {
    constructor(x, radius, speed, imageSrc) {
        this.posX = x;
        this.posY = window_height + radius;
        this.radius = radius;
        this.speed = speed;
        this.dy = -speed;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(context) {
        context.drawImage(this.image, this.posX - this.radius, this.posY - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.posY += this.dy;
        if (this.posY + this.radius < 0) {
            this.posY = window_height + this.radius;
        }
    }
}

function spawnCircles() {
    circles = [];
    removedCircles = 0;
    timeLeft = 15;
    startTimer();
    for (let i = 0; i < totalCircles; i++) {
        const x = Math.random() * (window_width - 60) + 30;
        const radius = Math.random() * 20 + 30;
        const speed = Math.random() + (level * 0.5); // Aumenta la velocidad con el nivel
        let newCircle = new Circle(x, radius, speed, "Media/Images/Nave.png"); // Reemplaza con la ruta de tu imagen
        circles.push(newCircle);
    }
    updateStats();
}

function updateStats() {
    let percentage = ((removedCircles / totalCircles) * 100).toFixed(2);
    stats.innerHTML = `Tiempo: ${timeLeft}s - Naves eliminadas: ${removedCircles}/${totalCircles} (${percentage}%) - Nivel: ${level}`;
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        updateStats();
        if (timeLeft <= 0) {
            clearInterval(timer);
            messageDiv.innerText = "Nivel fallado";
            messageDiv.style.display = "block";
            retryButton.style.display = "block";
        }
    }, 1000);
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    circles = circles.filter(circle => {
        let dx = mouseX - circle.posX;
        let dy = mouseY - circle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < circle.radius) {
            explosionSound.cloneNode().play();
            removedCircles++;
            updateStats();
            return false;
        }
        return true;
    });

    if (removedCircles >= totalCircles) {
        level++;
        spawnCircles();
    }
});

function updateCircles() {
    requestAnimationFrame(updateCircles);
    drawBackground();
    for (let circle of circles) {
        circle.update();
        circle.draw(ctx);
    }
}

spawnCircles();
updateCircles();