export class Shader {

    private vertex: string;
    private fragment: string;

    constructor(private context: WebGLRenderingContext) {

    }

    setVertex(vertex: string) {
        this.vertex = vertex;
    }

    setFragment(fragment: string) {
        this.fragment = fragment;
    }

    private getShader(code: string, type: 'vert' | 'frag') {
        let shader;
        if (type === 'vert') {
            shader = this.context.createShader(this.context.VERTEX_SHADER);
        } else if (type === 'frag') {
            shader = this.context.createShader(this.context.FRAGMENT_SHADER);
        } else {
            throw new Error('Shader type dont supported');
        }

        this.context.shaderSource(shader, code);
        this.context.compileShader(shader);
        if (!this.context.getShaderParameter(shader, this.context.COMPILE_STATUS)) {
            throw new Error("An error occurred compiling the shaders: " + this.context.getShaderInfoLog(shader));
        }

        return shader;
    }

    apply() {
        let program = <any>this.context.createProgram();

        if (this.vertex) {
            this.context.attachShader(program, this.getShader(this.vertex, 'vert'));
        }

        if (this.fragment) {
            this.context.attachShader(program, this.getShader(this.fragment, 'frag'));
        }

        this.context.linkProgram(program);

        if (!this.context.getProgramParameter(program, this.context.LINK_STATUS)) {
            throw new Error("Unable to initialize the shader program.");
        }

        this.context.useProgram(program);

        return program;
    }
}