import { IMap } from "../interfaces/IMap";
import * as PIXI from 'pixi.js';
import { prepareTileset } from "../utils/prepareTileset";
import * as _ from "underscore";

export class Map {

    private map = new PIXI.Container;;

    constructor(private url: string) {
    }

    parse() {
        return fetch(this.url).then((map) => map.json()).then((map: IMap) => {
            return Promise.all(map.tilesets.map(tileset => prepareTileset(tileset))).then(textures => {
                return textures.reduce((source, textures) => _.extend(textures, source), {});
            }).then(textures => ({ textures, map }));
        }).then(res => {
            return this.build(res.map, res.textures);
        });
    }

    private build(map: IMap, textures: { [key: number]: PIXI.Texture }) {
        map.layers.forEach((layer) => {
            let container = new PIXI.Container();
            if (layer.data) {
                layer.data.forEach((id, index) => {
                    if (id !== 0) {
                        let sprite = new PIXI.Sprite(textures[id]);
                        sprite.x = (index % map.width) * map.tilewidth;
                        sprite.y = Math.floor(index / map.width) * map.tileheight;
                        container.addChild(sprite);
                    }
                });
            }
            container.alpha = layer.opacity;
            container.visible = layer.visible;
            if(layer.name === 'collision'){
                container.visible = false;
            }
            container.cacheAsBitmap = true;
            this.map.addChild(container);
        });

        return this;
    }

    attach(container: PIXI.Container) {
        container.addChild(this.map);
        return container;
    }
}