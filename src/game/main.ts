import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig


// Tamagochi Scene
import Tamagochi from './scenes/Tamagochi';
import TamagochiRoom from './scenes/Tamagochi/Room';
import TamagochiUI from './scenes/Tamagochi/UI';
import TamagochiShop from './scenes/Tamagochi/Shop';
import { canvas } from './constants';



const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: canvas.width,
    height: canvas.height,
    parent: 'game-container',
    backgroundColor: '#FFFFFF',
    scene: [
        // Boot,
        // Preloader,
        // MainMenu,
        // MainGame,
        Tamagochi,
        TamagochiUI,
        TamagochiRoom,
        TamagochiShop,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
