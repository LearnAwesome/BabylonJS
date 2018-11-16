import './styles/index.scss';
// import 'pepjs';

// babylon101
// import Game from './babylon101/02.firstStep';
// import Game from './babylon101/03.discoverBasicElements';
// import Game from './babylon101/04.parametricShapes';
// import Game from './babylon101/05.positionAndRotation';
// import Game from './babylon101/06.materials';
import Game from './babylon101/07.cameras';

window.addEventListener('DOMContentLoaded', () => {
    const game = new Game('#renderCanvas');
    game.doRender();
});