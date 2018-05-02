import { ITileset } from "../interfaces/IMap";

export function spriteSheetMetadata(tileset: ITileset) {
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