import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig

// declare RexUIPligin to phaser.scene.rexUI
import 'phaser';

// Pulugins
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin.js';
import BBCodeTextPlugin from 'phaser3-rex-plugins/plugins/bbcodetext-plugin.js';

declare module 'phaser' {
  interface Scene {
    rexUI: RexUIPlugin;
  }
}

// General
import { canvas } from './constants';

// Tamagotchi Scene
import Tamagotchi from './scenes/Tamagotchi';
import TamagotchiRoom from './scenes/Tamagotchi/Room';
import TamagotchiShop from './scenes/Tamagotchi/Shop';

// Battle Scene
import Battle from './scenes/Battle';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: canvas.width,
    height: canvas.height,
    parent: 'game-container',
    // scale: {
    //     width: canvas.width,
    //     height: canvas.height,
    //     // parent: 'core',
    //     // fullscreenTarget: 'core',
    //     autoCenter: Phaser.Scale.CENTER_BOTH,
    //     mode: Phaser.Scale.FIT,
    // },
    zoom: 2,
    plugins: {
        global: [
            {
                key: 'rexBBCodeTextPlugin',
                plugin: BBCodeTextPlugin,
                start: true
            },
        ],
        scene: [
            {
                key: 'rexUI',
                plugin: RexUIPlugin,
                mapping: 'rexUI',
                start: true
            },
        ]
    },
    backgroundColor: '#FFFFFF',
    canvasStyle: `
        image-rendering: pixelated;
    `,
    scene: [
        // Boot,
        Preloader,
        // MainMenu,
        // MainGame,
        Tamagotchi,
        TamagotchiRoom,
        TamagotchiShop,
        Battle,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
