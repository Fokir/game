import { ITileset } from "../interfaces/IMap";
import * as PIXI from 'pixi.js';
import { spriteSheetMetadata } from "./spriteSheetMetadata";

export function prepareTileset(tileset: ITileset) {
    return new Promise<{ [key: string]: PIXI.Texture }>((resolve) => {
        var texture = PIXI.BaseTexture.fromImage(tileset.image);
            texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        new PIXI.Spritesheet(texture, spriteSheetMetadata(tileset)).parse((textures) => {
            resolve(textures as any);
        });
    });
}