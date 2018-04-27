
import { BaseShader } from '../shaders/base/BaseShader';

export class Render {
    private context: WebGLRenderingContext;

    private baseShader: BaseShader;

    constructor() {
        const canvas = document.createElement('canvas');
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        this.context = canvas.getContext('webgl', {});

        this.viewport(window.innerWidth, window.innerHeight);

        this.shaders();
    }

    initBuffers() {
        const squareVerticesBuffer = this.context.createBuffer();
        this.context.bindBuffer(this.context.ARRAY_BUFFER, squareVerticesBuffer);

        var vertices = [
            1.0, 1.0, 0.0,
            -1.0, 1.0, 0.0,
            1.0, -1.0, 0.0,
            -1.0, -1.0, 0.0
        ];

        this.context.bufferData(this.context.ARRAY_BUFFER, new Float32Array(vertices), this.context.STATIC_DRAW);

        return squareVerticesBuffer;
    }

    viewport(width: number, height: number) {
        this.context.viewport(0, 0, width, height);
    }

    shaders() {
        this.baseShader = new BaseShader(this.context);
    }

    draw() {
        this.context.clear(this.context.COLOR_BUFFER_BIT | this.context.DEPTH_BUFFER_BIT);

        this.context.bindBuffer(this.context.ARRAY_BUFFER, this.initBuffers());
        this.context.vertexAttribPointer(this.baseShader.vertexPositionAttribute, 3, this.context.FLOAT, false, 0, 0);
        this.context.drawArrays(this.context.TRIANGLE_STRIP, 0, 4);
    }
}