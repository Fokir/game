import { Render } from './Render';
import { lerp } from '../utils/lerp';
export class Camera {

    private targetStart = [];
    private target = [];
    private time = 0;

    constructor(private render: Render) {
        this.render.world.position.set(this.render._render.width / 2, this.render._render.height / 2);
    }

    move(x, y) {
        this.render.world.pivot.set(x, y);
    }

    smooth(x, y) {
        this.targetStart = [this.render.world.pivot.x, this.render.world.pivot.y];
        this.target = [x, y];
        this.time = 0;
    }

    update(delta) {
        if (this.targetStart && this.target) {
            this.time += delta;
            let x = lerp(this.targetStart[0], this.target[0], this.time / 500);
            let y = lerp(this.targetStart[1], this.target[1], this.time / 500);
            if (this.target[0] !== x && this.target[1] !== y) {
                this.move(x, y);
            } else {
                this.targetStart = null;
                this.target = null;
                this.time = 0;
            }
        }
    }
}