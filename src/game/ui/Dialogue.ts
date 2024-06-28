export class Dialogue extends Phaser.GameObjects.Container {
    onPointerDown!: () => void;
    onPointerUp!: () => void;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        width: number,
        height: number,
        key: string,
        text: string,
    )
    {
        super(scene);

        this.scene = scene;

        const board = this.scene.add.nineslice(x, y, 'ui', 'blue-box', width, height, 16, 16, 32, 16);

        this.scene.tweens.add({
            targets: board,
            width: 300,
            height: 300,
            duration: 1000,
            ease: 'sine.inout',
            yoyo: true,
            repeat: -1,
        });
        
        const boardText = this.scene.add.text(
            x,
            y,
            text,
            { fontSize: '28px', color: '#000000' }
        );
        
        Phaser.Display.Align.In.Center(boardText, board);
        
        this.add(board);
        this.add(boardText);

        board.on('pointerover', () => {
        });
        board.on('pointerout', () => {
        });
        
        board.on('pointerdown', () => {
            if (this.onPointerDown) {
                this.onPointerDown();
            }
        });

        board.on('pointerup', () => {
          if (this.onPointerUp) {
              this.onPointerUp();
          }
        });

        this.scene.add.existing(this);
    }

    private startDialog = function(): void {

    }
    private startOpenTraisiton = function(): void {

    }
    private startCloseTraisiton = function(): void {

    }
    private resetDialgue = function(): void {

    }
    
    public nextSentence = function() {
      
    }

    public open = () => {
        this.startOpenTraisiton();
        this.startDialog();
    }
    public close = () => {
        this.startCloseTraisiton();
        this.resetDialgue();
    }
}