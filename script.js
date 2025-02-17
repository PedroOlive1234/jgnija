const bg = new Audio('/assests/audio/bgm.mp3');
const p1 = new Audio('/assests/audio/blue.mp3');
const p2 = new Audio('/assests/audio/red.mp3');

bg.loop = true;
let bgPlaying = false;
let intervalo;
let partidaIniciada = false;
let novoJogoIniciado = false;

let healthPlayer1 = 100;
let healthPlayer2 = 100;

let selectedPlayer1 = "p1";
let selectedPlayer2 = "p2";

const habilidades = [
    { nome: 'Habilidade 1', chance: 5, cura: 20 },
    { nome: 'Habilidade 2', chance: 3, dano: 30 },
    { nome: 'Habilidade 3', chance: 2, dano: 50 }
];

const esquivaInimigo = 15;

let victories = localStorage.getItem('victories') ? parseInt(localStorage.getItem('victories')) : 0;
let defeats = localStorage.getItem('defeats') ? parseInt(localStorage.getItem('defeats')) : 0;

const startScreen = document.querySelector('.start-screen');
const playerSelectionScreen = document.querySelector('.player-selection-screen');
const gameScreen = document.getElementById('gameScreen');

const victoriesDisplay = document.getElementById('victories');
const defeatsDisplay = document.getElementById('defeats');
const musicButton = document.getElementById('musicControl');

const player1Element = document.querySelector('.player');
const player2Element = document.querySelector('.player-2');


const characters = document.querySelectorAll('.character');

characters.forEach(character => {
    character.addEventListener('click', () => {
        const player = character.getAttribute('data-player');
        const characterType = character.getAttribute('data-character');

        document.querySelectorAll(`.character[data-player="${player}"]`).forEach(c => {
            c.classList.remove('selected');
        });

        character.classList.add('selected');
        
        if (player === "1") {
            selectedPlayer1 = characterType;
        } else {
            selectedPlayer2 = characterType;
        }

        updateCharacterSelection();
    });
});

function updateCharacterSelection() {
    if (gameScreen.style.display === 'block') {
        player1Element.src = `/assests/${selectedPlayer1}.gif`;
        player2Element.src = `/assests/${selectedPlayer2}.gif`;
    }
}

document.getElementById('showPlayerSelectionButton').addEventListener('click', () => {
    startScreen.style.display = 'none';
    playerSelectionScreen.style.display = 'flex';
});

document.getElementById('backToMainButton').addEventListener('click', () => {
    playerSelectionScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});

const atualizarRecordes = () => {
    victoriesDisplay.textContent = victories;
    defeatsDisplay.textContent = defeats;
    localStorage.setItem('victories', victories);
    localStorage.setItem('defeats', defeats);
};

const rolarDado = (chance) => Math.floor(Math.random() * 20) + 1 + chance;

const atualizarBarraDeVida = (player, health) => {
    const healthBarFill = document.querySelector(`.health-bar${player === 1 ? '' : '.right'} .health-bar-fill`);
    healthBarFill.style.width = `${(health / 100) * 100}%`;
};

const animarJogador = (playerClass) => {
    const player = document.querySelector(`.${playerClass}`);
    player.classList.add('damage-animation');
    setTimeout(() => player.classList.remove('damage-animation'), 500);
};

const aplicarDano = () => {
    if (!partidaIniciada) return;

    const dano = rolarDado(0);
    const jogadorEscolhido = Math.random() < 0.5 ? 1 : 2;

    if (jogadorEscolhido === 1) {
        healthPlayer1 = Math.max(0, healthPlayer1 - dano);
        atualizarBarraDeVida(1, healthPlayer1);
        p1.play();
        animarJogador('player');
        if (healthPlayer1 === 0) derrotarJogador(1);
    } else {
        healthPlayer2 = Math.max(0, healthPlayer2 - dano);
        atualizarBarraDeVida(2, healthPlayer2);
        p2.play();
        animarJogador('player-2');
        if (healthPlayer2 === 0) derrotarJogador(2);
    }

    const inputControl = document.querySelector('.input-control');
    inputControl.value = dano;
};

const derrotarJogador = (perdedor) => {
    const inputControl = document.querySelector('.input-control');
    inputControl.value = '';

    if (perdedor === 1) {
        alert('Player 1 morreu! Game Over.');
        defeats++;
    } else {
        alert('Player 2 morreu! Victory.');
        victories++;
    }
    reiniciarPartida();
};

const reiniciarPartida = () => {
    healthPlayer1 = healthPlayer2 = 100;
    atualizarBarraDeVida(1, healthPlayer1);
    atualizarBarraDeVida(2, healthPlayer2);

    const inputControl = document.querySelector('.input-control');
    inputControl.value = '';

    bg.pause();
    bg.currentTime = 0;
    bgPlaying = false;
    musicButton.textContent = 'Play';
    clearInterval(intervalo);

    atualizarRecordes();
    
    if (!novoJogoIniciado) {
        partidaIniciada = false;
        startScreen.style.display = 'flex';
        gameScreen.style.display = 'none';
    } else {
        novoJogoIniciado = false;
    }
};

const iniciarLoopDeDano = () => {
    intervalo = setInterval(aplicarDano, 2000);
};

const aplicarHabilidade = (jogador) => {
    if (!partidaIniciada) {
        alert('A partida ainda não começou! Por favor, inicie a partida pressionando "Play".');
        return;
    }

    const habilidade = habilidades[jogador];
    const dadoRolado = rolarDado(habilidade.chance);
    const acerto = dadoRolado >= esquivaInimigo;

    if (acerto) {
        if (habilidade.cura) {
            healthPlayer1 = Math.min(100, healthPlayer1 + habilidade.cura);
            atualizarBarraDeVida(1, healthPlayer1);
            alert(`${habilidade.nome} curou ${habilidade.cura} pontos de vida!`);
            animarJogador('player');
        } else if (habilidade.dano) {
            healthPlayer2 = Math.max(0, healthPlayer2 - habilidade.dano);
            atualizarBarraDeVida(2, healthPlayer2);
            alert(`${habilidade.nome} acertou! Causou ${habilidade.dano} de dano.`);
            animarJogador('player-2');

            if (healthPlayer2 <= 0) {
                derrotarJogador(2);
            }
        }
    } else {
        alert(`${habilidade.nome} falhou!`);
    }
};

document.getElementById('ability1').addEventListener('click', () => aplicarHabilidade(0));
document.getElementById('ability2').addEventListener('click', () => aplicarHabilidade(1));
document.getElementById('ability3').addEventListener('click', () => aplicarHabilidade(2));

musicButton.addEventListener('click', () => {
    if (!bgPlaying) {
        bg.play();
        bgPlaying = true;
        musicButton.textContent = 'Stop';
        iniciarLoopDeDano();
        partidaIniciada = true;
    } else {
        bg.pause();
        bg.currentTime = 0;
        bgPlaying = false;
        musicButton.textContent = 'Play';
        clearInterval(intervalo);
        partidaIniciada = false;
    }
});

document.getElementById('startGameButton').addEventListener('click', () => {
    playerSelectionScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    document.body.style.overflow = 'auto';
    partidaIniciada = true;

    player1Element.src = `/assests/${selectedPlayer1}.gif`;
    player2Element.src = `/assests/${selectedPlayer2}.gif`;
    
    document.querySelector(`.character[data-player="1"][data-character="${selectedPlayer1}"]`).classList.add('selected');
    document.querySelector(`.character[data-player="2"][data-character="${selectedPlayer2}"]`).classList.add('selected');
    
    victories = localStorage.getItem('victories') ? parseInt(localStorage.getItem('victories')) : 0;
    defeats = localStorage.getItem('defeats') ? parseInt(localStorage.getItem('defeats')) : 0;
    
    atualizarRecordes();
});

document.getElementById('newGameButton').addEventListener('click', () => {
    victories = 0;
    defeats = 0;
 
    atualizarRecordes();

    novoJogoIniciado = true;
    reiniciarPartida();
 
    startScreen.style.display = 'none';
    playerSelectionScreen.style.display = 'flex';
    
    console.log('Novo jogo iniciado com recordes zerados!');
});

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector(`.character[data-player="1"][data-character="${selectedPlayer1}"]`).classList.add('selected');
    document.querySelector(`.character[data-player="2"][data-character="${selectedPlayer2}"]`).classList.add('selected');
});