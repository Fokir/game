export class Keyboard {

    private pressed = {};

    constructor(canvas: HTMLCanvasElement) {
        console.log(canvas);
        canvas.tabIndex = 1;
        
        canvas.addEventListener('keydown', (e)=>{
            this.pressed[e.key.toLowerCase()] = true;    
        });
        canvas.addEventListener('keyup', (e)=>{
            this.pressed[e.key.toLowerCase()] = false;       
        });
    }

    is(key: string){
        return !!this.pressed[key];
    }
}