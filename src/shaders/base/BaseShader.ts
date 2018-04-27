import { Shader } from '../../render/Shader';
import baseShaderVertex from './base.vert';
import baseShaderFragment from './base.frag';

export class BaseShader extends Shader {

    public vertexPositionAttribute;

    constructor(context: WebGLRenderingContext) {
        super(context);

        this.setVertex(baseShaderVertex);
        this.setFragment(baseShaderFragment);

        const program = this.apply();

        this.vertexPositionAttribute = context.getAttribLocation(program, "aVertexPosition");
        context.enableVertexAttribArray(this.vertexPositionAttribute);
    }


}