import * as PIXI from 'pixi.js';
import { ITileset } from './interfaces/IMap';

export class Render {
    app: PIXI.Application;
    baseContainer = new PIXI.Container();

    constructor() {
        this.app = new PIXI.Application(window.innerWidth, window.innerHeight, { backgroundColor: 0x000000 });
        document.body.appendChild(this.app.view);
        this.initStats();

        this.app.renderer.options.antialias = true;
        this.app.stage.addChild(this.baseContainer);
        this.app.start();
    }

    prepareTileset(tileset: ITileset) {
        return new Promise<{ [key: string]: PIXI.Texture }>((resolve, reject) => {
            var texture = PIXI.BaseTexture.fromImage(tileset.image);
                texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
            new PIXI.Spritesheet(texture, this.genearateSpriteSheetMetadata(tileset)).parse((textures) => {
                resolve(textures as any);
            });
        });
    }

    initStats() {
        let stats = new Stats();
        stats.showPanel(0);
        document.body.appendChild(stats.dom);

        this.app.renderer.addListener('prerender', () => {
            stats.begin();
        })

        this.app.renderer.addListener('postrender', () => {
            stats.end();
        })
    }

    genearateSpriteSheetMetadata(tileset: ITileset) {
        let data = {
            meta: {
                scale: 1,
                image: tileset.image,
                size: { w: tileset.imagewidth, h: tileset.imageheight }
            },
            frames: {}
        };

        let rows = Math.ceil(tileset.tilecount / tileset.columns);
        var count = tileset.firstgid;
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < tileset.columns; x++) {
                data.frames[count] = {
                    frame: {
                        x: x * tileset.tilewidth + tileset.spacing * x,
                        y: y * tileset.tileheight + tileset.spacing * y,
                        w: tileset.tilewidth,
                        h: tileset.tileheight
                    },
                    rotated: false,
                    trimmed: false,
                    spriteSourceSize: { x: 0, y: 0, w: tileset.tilewidth, h: tileset.tileheight },
                    sourceSize: { w: tileset.tilewidth, h: tileset.tileheight }
                };
                count++;
            }
        }

        return data;
    }

    tick(callback: (delta: number) => void) {
        this.app.ticker.add(callback);
        return () => {
            this.app.ticker.remove(callback);
        }
    }
}