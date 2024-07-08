import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512-230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on('progress', (progress: number) => {

            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + (460 * progress);

        });
    }

    preload ()
    {
        this.load.setPath('assets');
        
        //  Load the assets for the game - Replace with your own assets
        this.load.image('logo', 'logo.png');
        this.load.image('star', 'star.png');

        // Tamagochi
        this.load.atlas('person', 'spritesheets/person/motions.png', 'spritesheets/person/motions.json');
        this.load.atlas('default', 'spritesheets/default/motions.png', 'spritesheets/default/motions.json');
        this.load.atlas('default-battle', 'spritesheets/default/battle.png', 'spritesheets/default/battle.json');
        this.load.atlas('heart', 'spritesheets/energy/heart.png', 'spritesheets/energy/heart.json');
        this.load.atlas('battery', 'spritesheets/energy/battery.png', 'spritesheets/energy/battery.json');
        this.load.atlas('header-icons', 'spritesheets/header/icons.png', 'spritesheets/header/icons.json');
        
        this.load.atlas('battle-character-1', 'spritesheets/battle-character-1/character.png', 'spritesheets/battle-character-1/character.json');
        this.load.atlas('battle-character-2', 'spritesheets/battle-character-2/character.png', 'spritesheets/battle-character-2/character.json');
        this.load.atlas('status-board-hp', 'spritesheets/status-board/hp.png', 'spritesheets/status-board/hp.json');

        this.load.image('background-room', 'background-room.png');
        this.load.image('transition-cover', 'transition-cover.png');
        this.load.image('happy_1', 'spritesheets/default/1.png');
        this.load.image('happy_2', 'spritesheets/default/2.png');
        this.load.atlas('frame', 'ui/frame.png', 'ui/frame.json');

        // this.load.image('star', 'star.png');
        this.load.image('star_up', 'star.png');
        this.load.image('star_reverse', 'star.png');
    }

    create ()
    {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start('Tamagochi');
    }
}
