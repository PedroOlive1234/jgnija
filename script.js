const bg = new Audio('/assests/audio/bgm.mp3');
const p1 = new Audio('/assests/audio/blue.mp3');
const p2 = new Audio('/assests/audio/red.mp3');

bg.loop = true;
let bgPlaying = false;
let intervalo;
let partidaIniciada = false; 

let healthPlayer1 = 100;
let healthPlayer2 = 100;

const habilidades = [
    { nome: 'Habilidade 1', chance: 5, cura: 20 },
    { nome: 'Habilidade 2', chance: 3, dano: 30 },
    { nome: 'Habilidade 3', chance: 2, dano: 50 }
];

const esquivaInimigo = 15;

let victories = localStorage.getItem('victories') ? parseInt(localStorage.getItem('victories')) : 0;
let defeats = localStorage.getItem('defeats') ? parseInt(localStorage.getItem('defeats')) : 0;

const victoriesDisplay = document.getElementById('victories');
const defeatsDisplay = document.getElementById('defeats');
const musicButton = document.getElementById('musicControl');

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
        alert('Player 1 morreu! A partida será reiniciada.');
        defeats++;
    } else {
        alert('Player 2 morreu! A partida será reiniciada.');
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
    partidaIniciada = false; 
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

atualizarRecordes();