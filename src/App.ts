import { Keyboard } from './Keyboard';
import { mapsConfig } from './config/maps';
import { Map } from './engine/Map';
import { Render } from './render/Render';
import { Player } from './player/Player';
import { Camera } from './render/Camera';

export class App {
    private render = new Render;
    private keyboard = new Keyboard(this.render.getView());
    private camera = new Camera(this.render);

    private mainPlayer = new Player('blue', 'big');

    constructor() {
        this.render.tick((delta) => {
            this.camera.update(delta);
            let speed = this.keyboard.is('shift') ? 1 : 0.1;
            let direction = [0, 0];
            if (this.keyboard.is('w')) {
                direction[1]--;
            }
            if (this.keyboard.is('s')) {
                direction[1]++;
            }
            if (this.keyboard.is('a')) {
                direction[0]--;
            }
            if (this.keyboard.is('d')) {
                direction[0]++;
            }

            if (direction[0] !== 0 || direction[1] !== 0) {
                this.mainPlayer.direction = direction;
                this.mainPlayer.position.x += direction[0] * delta * 0.05;
                this.mainPlayer.position.y += direction[1] * delta * 0.05;
                this.mainPlayer.walking = true;
            } else {
                this.mainPlayer.walking = false;
            }
            
            this.camera.smooth(this.mainPlayer.position.x + 8, this.mainPlayer.position.y + 8);
        });

        this.mainPlayer.position.set(550, 500);

        this.render.draw();
    }

    run() {
        // return this.render.pixiLogo().then(()=>{
        return this.level('reborn').then(() => {
            return this.mainPlayer.prepare().then(() => {
                this.mainPlayer.attach(this.render.world);

                this.render.tick((delta) => {
                    this.mainPlayer.update();
                });
            });
        });
        // })
    }

    level(name: string) {
        const map = mapsConfig[name];
        if (!map) {
            throw new Error(`Map "${name}" not found`);
        }
        let mapInstance = new Map(map.link);

        return mapInstance.parse().then(() => {
            mapInstance.attach(this.render.world);
        });
    }
}