import * as PIXI from 'pixi.js';
import { EventEmmiter } from '../utils/EventEmmiter';

export class Render {
    public stage = new PIXI.Container();
    public world = new PIXI.Container();

    private render: PIXI.WebGLRenderer;
    private event = new EventEmmiter();

    private lastTimeFrame = 0;

    get _render() {
        return this.render;
    }

    constructor() {
        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.stage.addChild(this.world);

        this.render = new PIXI.WebGLRenderer({
            view: canvas,
            width: window.innerWidth,
            height: window.innerHeight,
        });

        this.initStats();

        this.world.scale.set(2);
    }

    getView() {
        return this.render.view;
    }

    pixiLogo() {
        const logo = PIXI.Sprite.fromImage('./../../textures/pixi.png');
        logo.x = window.innerWidth / 2;
        logo.y = window.innerHeight / 2;
        logo.anchor.set(0.5, 0.5);
        this.stage.addChild(logo);

        return new Promise((resolve) => {
            let unsubscribe = this.event.subscribe('tick', (delta: number) => {
                logo.alpha = logo.alpha - 0.2 / delta;
                if (logo.alpha <= 0) {
                    unsubscribe();
                    resolve();
                }
            });
        });
    }

    initStats() {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        this.event.subscribe('before', () => {
            stats.begin();
        });
        this.event.subscribe('after', () => {
            stats.end();
        });
    }

    draw() {
        this.render.render(this.stage);
        requestAnimationFrame((time: number) => {
            let delta = time - this.lastTimeFrame;
            this.lastTimeFrame = time;
            this.event.emit('before', delta);
            this.event.emit('tick', delta);
            this.event.emit('after', delta);
            this.draw();
        })
    }

    tick(callback: (delta: number) => void) {
        return this.event.subscribe('tick', callback);
    }
}