const bg = new Audio();
bg.src = '/assests/audio/bgm.mp3';
bg.loop = true;

const p1 = new Audio();
p1.src = '/assests/audio/blue.mp3';

const p2 = new Audio();
p2.src = '/assests/audio/red.mp3';

let bgPlaying = false;
const musicButton = document.getElementById('musicControl');
let intervalo;

let healthPlayer1 = 100;
let healthPlayer2 = 100;

function gerarNumeroAleatorio() {
    return Math.floor(Math.random() * 20) + 1;
}

function escolherJogador() {
    return Math.random() < 0.5 ? 1 : 2;
}

function aplicarDano() {
    const dano = gerarNumeroAleatorio();
    const jogadorEscolhido = escolherJogador();

    const inputControl = document.querySelector('.input-control');
    inputControl.value = dano;

    if (jogadorEscolhido === 1) {
        healthPlayer1 -= dano;
        if (healthPlayer1 < 0) healthPlayer1 = 0;
        atualizarBarraDeVida(1, healthPlayer1);
        p1.play();
        animarJogador('player');

        if (healthPlayer1 === 0) {
            alert('Player 1 morreu! A partida será reiniciada.');
            reiniciarPartida();
        }
    } else {
        healthPlayer2 -= dano;
        if (healthPlayer2 < 0) healthPlayer2 = 0;
        atualizarBarraDeVida(2, healthPlayer2);
        p2.play();
        animarJogador('player-2');

        if (healthPlayer2 === 0) {
            alert('Player 2 morreu! A partida será reiniciada.');
            reiniciarPartida();
        }
    }
}

function atualizarBarraDeVida(player, health) {
    const healthBarFill = player === 1
        ? document.querySelector('.health-bar .health-bar-fill')
        : document.querySelector('.health-bar.right .health-bar-fill');
    
    const healthPercentage = (health / 100) * 100;
    healthBarFill.style.width = `${healthPercentage}%`;
}

function animarJogador(playerClass) {
    const player = document.querySelector(`.${playerClass}`);
    player.classList.add('damage-animation');
    setTimeout(() => {
        player.classList.remove('damage-animation');
    }, 500);
}

function reiniciarPartida() {
    healthPlayer1 = 100;
    healthPlayer2 = 100;
    atualizarBarraDeVida(1, healthPlayer1);
    atualizarBarraDeVida(2, healthPlayer2);

    bg.pause();
    bg.currentTime = 0;
    bgPlaying = false;
    musicButton.textContent = 'Play Music';
    clearInterval(intervalo);
}

function iniciarLoopDeDano() {
    intervalo = setInterval(() => {
        aplicarDano();
    }, 2000);
}

musicButton.addEventListener('click', function() {
    if (!bgPlaying) {
        bg.play();
        bgPlaying = true;
        musicButton.textContent = 'Stop';
        iniciarLoopDeDano();
    } else {
        bg.pause();
        bg.currentTime = 0;
        bgPlaying = false;
        musicButton.textContent = 'Play';
        clearInterval(intervalo);
    }
});
