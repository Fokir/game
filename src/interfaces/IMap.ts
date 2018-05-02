export interface ITileset {
    firstgid: number;
    image: string;
    columns: number;
    imageheight: number;
    imagewidth: number;
    margin: number;
    name: string;
    spacing: number;
    tilecount: number;
    tileheight: number;
    tilewidth: number;
}

export interface ILayerMap {
    data: number[];
    height: number;
    name: string;
    opacity: number;
    properties: { [key: string]: string | number | boolean };
    propertytypes: { [key: string]: 'int' | 'bool' | 'string' };
    type: string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export interface IMap {
    backgroundcolor: string;
    height: number;
    width: number;
    infinite: boolean;
    layers: ILayerMap[];
    nextobjectid: number;
    orientation: string;
    renderorder: string;
    tiledversion: string;
    tileheight: number;
    tilewidth: number;
    tilesets: ITileset[];
    type: string;
    version: number
}

export interface IMapConfig {
    [key: string]: {
        name: string;
        link: string;
    }
}