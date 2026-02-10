const envelope = document.getElementById('envelope');
const closeBtn = document.getElementById('close');
const heartsContainer = document.getElementById('hearts-container');
const music = document.getElementById('background-music');
const photos = document.querySelectorAll('.polaroid-photo');

// Elementos del video
const surpriseBtn = document.getElementById('surprise-btn');
const videoContainer = document.getElementById('video-container');
const surpriseVideo = document.getElementById('surprise-video');

let heartsInterval;
let photoInterval; 
let currentPhotoIndex = 0;

// --- FUNCIÓN DE CORAZONES ---
function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.innerHTML = '❤️';
    
    heart.style.left = Math.random() * 100 + 'vw';
    const size = Math.random() * 15 + 15;
    heart.style.fontSize = size + 'px';
    heart.style.animationDuration = Math.random() * 2 + 3 + 's';
    heart.style.opacity = Math.random() * 0.5 + 0.3;
    
    heartsContainer.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
}

// --- FUNCIÓN DEL SLIDESHOW POLAROID ---
function startPhotoSlideshow() {
    if (photoInterval) return; 

    photoInterval = setInterval(() => {
        if (photos.length > 0) {
            photos[currentPhotoIndex].classList.remove('active');
            currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
            photos[currentPhotoIndex].classList.add('active');
        }
    }, 2000);
}

// --- FUNCIÓN EFECTO SCRAMBLE ---
function solveText(element, finalMessage) {
    if (!element) return;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';
    let iteration = 0;

    let scrambleInterval = setInterval(() => {
        element.innerText = finalMessage
            .split("")
            .map((letter, index) => {
                if (index < iteration) return finalMessage[index]; 
                if (letter === " ") return " "; 
                return chars[Math.floor(Math.random() * chars.length)]; 
            })
            .join("");

        if (iteration >= finalMessage.length) clearInterval(scrambleInterval);
        iteration += 1 / 3; 
    }, 30);
}

// --- EVENTO ÚNICO PARA ABRIR EL SOBRE ---
envelope.addEventListener('click', () => {
    if (!envelope.classList.contains('open')) {
        envelope.classList.add('open');
        
        if (music) {
            music.currentTime = 54; 
            music.play().catch(e => console.log("Autoplay bloqueado"));
        }

        createHeart();
        heartsInterval = setInterval(createHeart, 300);
        startPhotoSlideshow();

        setTimeout(() => {
            const target = document.getElementById("scramble-title"); 
            solveText(target, "Será nuestra canción siempre ❤️");
        }, 1500); 
    }
});

// --- EVENTO PARA CERRAR ---
closeBtn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    if (music) {
        music.pause();
        music.currentTime = 0;
    }
    clearInterval(heartsInterval);
    clearInterval(photoInterval);
    location.reload(); 
});

// --- EVENTO BOTÓN SORPRESA (VIDEO LOCAL) ---
if (surpriseBtn) {
    surpriseBtn.addEventListener('click', () => {
        videoContainer.style.display = 'block';
        surpriseBtn.style.display = 'none';

        if (music) {
            music.pause();
        }

        if (surpriseVideo) {
            // REPARACIÓN PANTALLA NEGRA: Forzamos la carga del archivo
            surpriseVideo.load(); 
            
            surpriseVideo.play().catch(e => {
                console.log("Error al reproducir video:", e);
                // Si falla el play, al menos mostramos los controles
                surpriseVideo.controls = true;
            });
            
            setTimeout(() => {
                videoContainer.scrollIntoView({ behavior: 'smooth' });
            }, 200);
        }
    });
}

// --- LÓGICA DEL SECRETO FINAL ---
const secretSection = document.getElementById('secret-section');
const btnSi = document.getElementById('btn-si');
const btnNo = document.getElementById('btn-no');

// Detectar cuando el video termina
surpriseVideo.addEventListener('ended', () => {
    secretSection.style.display = 'block';
    secretSection.scrollIntoView({ behavior: 'smooth' });
});

// Si responde que SÍ
btnSi.addEventListener('click', () => {
    alert("¡Eres lo mejor que me ha pasado en la vida! ❤️"); 
    // O puedes cambiar el texto por un mensaje más bonito en pantalla
    secretSection.innerHTML = "<h3 class='romantic-title'>¡Revisa dentro de la cartera! ❤️</h3>";
});

// Si responde que NO (Efecto divertido: el botón se escapa o simplemente da un mensaje)
btnNo.addEventListener('click', () => {
    alert("¡Igual te lo voy a decir porque te amo! 😂");
    btnSi.click(); // Forzamos el mensaje positivo
});