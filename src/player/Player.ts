import * as PIXI from 'pixi.js';

export type PlayerColor = 'white' | 'black' | 'blue' | 'green' | 'red';
export type PlayerSize = 'big' | 'small';

export class Player {

    private stage = new PIXI.Container;

    private walk_left: PIXI.extras.AnimatedSprite;
    private walk_right: PIXI.extras.AnimatedSprite;
    private walk_up: PIXI.extras.AnimatedSprite;
    private walk_down: PIXI.extras.AnimatedSprite;

    private idle_left: PIXI.extras.AnimatedSprite;
    private idle_right: PIXI.extras.AnimatedSprite;
    private idle_up: PIXI.extras.AnimatedSprite;
    private idle_down: PIXI.extras.AnimatedSprite;

    public walking = false;
    public direction = [0, 1];

    get position() {
        return this.stage.position;
    }

    constructor(public readonly color: PlayerColor, public readonly size: PlayerSize) {

    }

    

    prepare() {
        return new Promise((resolve) => {
            let loader = new PIXI.loaders.Loader;
            loader.add('player_spritesheet', '/textures/player.png').load(() => {
                this.buildAnimations(loader.resources.player_spritesheet.texture.baseTexture);
                resolve();
            });
        });
    }

    attach(stage: PIXI.Container) {
        stage.addChild(this.stage);
    }

    spawn(x: number, y: number) {
        this.stage.position.set(x, y);
    }

    private buildAnimations(base: PIXI.BaseTexture) {
        const offsetX = ['white', 'black', 'blue', 'green', 'red'].indexOf(this.color) * 3;
        const offsetY = ['big', 'small'].indexOf(this.size) * 3;
        const frames = [];
        for (let x = 0; x < 3; x++) {
            for (let y = 0; y < 6; y++) {
                let frame = new PIXI.Rectangle((x + offsetX) * 16, (y + offsetY) * 16, 16, 16);
                let texture = new PIXI.Texture(base, frame);
                frames.push(texture);
            }
        }

        this.walk_down = this.getAnimations(frames, 0, 6, 0, 12);
        this.idle_down = this.getAnimations(frames, 0);

        this.walk_left = this.getAnimations(frames, 1, 7, 1, 13);
        this.idle_left = this.getAnimations(frames, 1);

        this.walk_right = this.getAnimations(frames, 1, 7, 1, 13);
        this.idle_right = this.getAnimations(frames, 1);
        this.walk_right.scale.x = -1;
        this.walk_right.anchor.x = 1;
        this.idle_right.scale.x = -1;
        this.idle_right.anchor.x = 1;

        this.walk_up = this.getAnimations(frames, 2, 8, 2, 14);
        this.idle_up = this.getAnimations(frames, 2);

        this.stage.addChild(this.walk_down);
        this.stage.addChild(this.walk_left);
        this.stage.addChild(this.walk_right);
        this.stage.addChild(this.walk_up);
        this.stage.addChild(this.idle_down);
        this.stage.addChild(this.idle_left);
        this.stage.addChild(this.idle_right);
        this.stage.addChild(this.idle_up);
    }

    private getAnimations(frames: PIXI.Texture[], ...indexes: number[]) {
        let animation = new PIXI.extras.AnimatedSprite(indexes.map(i => frames[i]));
        animation.width = 16;
        animation.animationSpeed = 0.09;
        animation.play();
        return animation;
    }

    private hideAll() {
        [this.walk_down, this.walk_left, this.walk_right, this.walk_up, this.idle_down, this.idle_left, this.idle_right, this.idle_up]
            .forEach(i => i.visible = false);
    }

    public update() {
        this.hideAll();
        if (this.direction[0] > 0 && this.walking) {
            this.walk_right.visible = true;
        } else if (this.direction[0] < 0 && this.walking) {
            this.walk_left.visible = true;
        } else if (this.direction[0] > 0 && !this.walking) {
            this.idle_right.visible = true;
        } else if (this.direction[0] < 0 && !this.walking) {
            this.idle_left.visible = true;
        } else if (this.direction[1] > 0 && this.walking) {
            this.walk_down.visible = true;
        } else if (this.direction[1] < 0 && this.walking) {
            this.walk_up.visible = true;
        } else if (this.direction[1] > 0 && !this.walking) {
            this.idle_down.visible = true;
        } else if (this.direction[1] < 0 && !this.walking) {
            this.idle_up.visible = true;
        }
    }
}