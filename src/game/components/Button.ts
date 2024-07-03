export class Button extends Phaser.GameObjects.Container {
    onPointerDown!: () => void;
    onPointerUp!: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        key: string,
        text: string,
    )
    {
        super(scene);

        this.scene = scene;
        this.x = x;
        this.y = y;

        const button = this.scene.add.image(x, y, `${key}_up`).setInteractive();
        const buttonText = this.scene.add.text(
            x,
            y,
            text,
            { fontSize: '12px', color: '#000000', fontFamily: 'futura' }
        );
        
        Phaser.Display.Align.In.Center(buttonText, button);
        
        this.add(button);
        this.add(buttonText);

        button.on('pointerover', () => {
            button.setTexture(`${key}_down`);
        });
        button.on('pointerout', () => {
            button.setTexture(`${key}_up`);
        });
        
        button.on('pointerdown', () => {
            button.setTexture(`${key}_down`);
            if (this.onPointerDown) {
                this.onPointerDown();
            }
        });

        button.on('pointerup', () => {
            button.setTexture(`${key}_up`);
            if (this.onPointerUp) {
                this.onPointerUp();
            }
        });

        this.scene.add.existing(this);
    }
}