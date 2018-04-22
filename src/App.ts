import { Render } from './Render';
import { IMap } from './interfaces/IMap';
import * as _ from 'underscore';
import * as PIXI from 'pixi.js';
import { Keyboard } from './Keyboard';

export class App {
    private render = new Render;
    private keyboard = new Keyboard(this.render.app.view);

    constructor() {
        this.render.tick((delta)=>{
            let speed = this.keyboard.is('shift') ? 10 : 2;
            if(this.keyboard.is('w')){
                this.render.baseContainer.y += -1 * speed * delta;
            }
            if(this.keyboard.is('s')){
                this.render.baseContainer.y += speed * delta;
            }
            if(this.keyboard.is('a')){
                this.render.baseContainer.x += -1 * speed * delta;
            }
            if(this.keyboard.is('d')){
                this.render.baseContainer.x += speed * delta;
            }
        });
    }

    loadMap(url: string) {
        return fetch(url).then((map) => map.json()).then((map: IMap) => {
            return Promise.all(map.tilesets.map(tileset => this.render.prepareTileset(tileset))).then(textures => {
                return textures.reduce((source, textures) => _.extend(textures, source), {});
            }).then(textures => ({ textures, map }));
        }).then(res => {
            this.buildMap(res.map, res.textures);
        });
    }

    buildMap(map: IMap, textures: { [key: number]: PIXI.Texture }) {
        map.layers.forEach((layer) => {
            let container = new PIXI.Container();
            layer.data.forEach((id, index) => {
                if (id !== 0) {
                    let sprite = new PIXI.Sprite(textures[id]);
                    sprite.x = (index % map.width) * map.tilewidth;
                    sprite.y = Math.floor(index / map.width) * map.tileheight;
                    container.addChild(sprite);
                }
            });
            container.scale.set(1.5, 1.5);
            container.cacheAsBitmap = true;
            this.render.baseContainer.addChild(container);
        });
    }
}