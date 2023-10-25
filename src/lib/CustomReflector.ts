import * as THREE from 'three';

// The below mirror object code is generously donated by ths significantly smarter people found here:
// https://discourse.threejs.org/t/requesting-help-with-showing-object-in-reflector-but-hiding-it-from-environment-in-hubs/17370/2
//      Accessed: 07/10/2023
// https://jsfiddle.net/oqakydzw
//      Accessed: 07/10/2023

export class Reflector extends THREE.Mesh {
    renderTarget: any;

    colour: THREE.Color;
    textureWidth: number;
    textureHeight: number;
    clipBias: number;
    shader: any;

    reflectorPlane: THREE.Plane;
    normal: THREE.Vector3;
    reflectorWorldPosition: THREE.Vector3;
    cameraWorldPosition: THREE.Vector3;
    rotationMatrix: THREE.Matrix4;
    lookAtPosition: THREE.Vector3;
    clipPlane: THREE.Vector4;

    view: THREE.Vector3;
    target: THREE.Vector3;
    q: THREE.Vector4;

    textureMatrix: THREE.Matrix4;
    virtualCamera: THREE.PerspectiveCamera;
    
    parameters: { minFilter: any, magFilter: any, format: any, stencilBuffer: boolean }

    constructor(geometry: any, options: any) {
        super(geometry);
        options = options || {};

        this.colour = ( options.colour !== undefined ) ? new THREE.Color( options.colour ) : new THREE.Color( 0x7f7f7f );
        this.textureWidth = options.textureWidth || 512;
        this.textureHeight = options.textureHeight || 512;
        this.clipBias = options.clipBias || 0;
        this.shader = options.shader || this.ReflectorShader;

        this.reflectorPlane = new THREE.Plane();
        this.normal = new THREE.Vector3();
        this.reflectorWorldPosition = new THREE.Vector3();
        this.cameraWorldPosition = new THREE.Vector3();
        this.rotationMatrix = new THREE.Matrix4();
        this.lookAtPosition = new THREE.Vector3(0, 0, -1);
        this.clipPlane = new THREE.Vector4();

        this.view = new THREE.Vector3();
        this.target = new THREE.Vector3();
        this.q = new THREE.Vector4();

        this.textureMatrix = new THREE.Matrix4();
        this.virtualCamera = new THREE.PerspectiveCamera();

        this.parameters = {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            stencilBuffer: false,
        }

        this.renderTarget = new THREE.WebGLRenderTarget( this.textureWidth, this.textureHeight, this.parameters );

        if ( !THREE.MathUtils.isPowerOfTwo(this.textureWidth) || !THREE.MathUtils.isPowerOfTwo(this.textureHeight) ) {
            this.renderTarget.texture.generateMipmaps = false;
        }

        const material = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone( this.shader.uniforms ),
            fragmentShader: this.shader.fragmentShader,
            vertexShader: this.shader.vertexShader,
        });

        material.uniforms['tDiffuse'].value = this.renderTarget.texture;
        material.uniforms['color'].value = this.colour;
        material.uniforms['textureMatrix'].value = this.textureMatrix;
        this.material = material;
    };

    onBeforeRender = function(this: any, renderer: any, scene: any, camera: any ): void {
        this.reflectorWorldPosition.setFromMatrixPosition( this.matrixWorld );
        this.cameraWorldPosition.setFromMatrixPosition( camera.matrixWorld );

        this.rotationMatrix.extractRotation( this.matrixWorld );

        this.normal.set(0, 0, 1);
        this.normal.applyMatrix4( this.rotationMatrix );

        this.view.subVectors( this.reflectorWorldPosition, this.cameraWorldPosition );

        // avoid rendering when reflector is facing away
        if ( this.view.dot( this.normal ) > 0) return; 

        this.view.reflect( this.normal ).negate();
        this.view.add( this.reflectorWorldPosition );

        this.rotationMatrix.extractRotation( camera.matrixWorld );

        this.lookAtPosition.set( 0, 0, - 1 );
        this.lookAtPosition.applyMatrix4( this.rotationMatrix );
        this.lookAtPosition.add( this.cameraWorldPosition );

        this.target.subVectors( this.reflectorWorldPosition, this.lookAtPosition );
        this.target.reflect( this.normal ).negate();
        this.target.add( this.reflectorWorldPosition );

        this.virtualCamera.position.copy( this.view );
        this.virtualCamera.up.set( 0, 1, 0 );
        this.virtualCamera.up.applyMatrix4( this.rotationMatrix );
        this.virtualCamera.up.reflect( this.normal );
        this.virtualCamera.lookAt( this.target );

        this.virtualCamera.far = camera.far; // Used in WebGLBackground

        this.virtualCamera.updateMatrixWorld();
        this.virtualCamera.projectionMatrix.copy( camera.projectionMatrix );
        // Update camera matrix to cover more visible space then the player camera
        this.virtualCamera.fov = 120;
        this.virtualCamera.aspect = 3;
        this.virtualCamera.updateProjectionMatrix();

        // Update the texture matrix
        this.textureMatrix.set(
            0.5, 0.0, 0.0, 0.5,
            0.0, 0.5, 0.0, 0.5,
            0.0, 0.0, 0.5, 0.5,
            0.0, 0.0, 0.0, 1.0
        );
        this.textureMatrix.multiply( this.virtualCamera.projectionMatrix );
        this.textureMatrix.multiply( this.virtualCamera.matrixWorldInverse );
        this.textureMatrix.multiply( this.matrixWorld );

        // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
        // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
        this.reflectorPlane.setFromNormalAndCoplanarPoint( this.normal, this.reflectorWorldPosition );
        this.reflectorPlane.applyMatrix4( this.virtualCamera.matrixWorldInverse );

        this.clipPlane.set( this.reflectorPlane.normal.x, this.reflectorPlane.normal.y, this.reflectorPlane.normal.z, this.reflectorPlane.constant );

        const projectionMatrix = this.virtualCamera.projectionMatrix;

        this.q.x = ( Math.sign( this.clipPlane.x ) + projectionMatrix.elements[ 8 ] ) / projectionMatrix.elements[ 0 ];
        this.q.y = ( Math.sign( this.clipPlane.y ) + projectionMatrix.elements[ 9 ] ) / projectionMatrix.elements[ 5 ];
        this.q.z = - 1.0;
        this.q.w = ( 1.0 + projectionMatrix.elements[ 10 ] ) / projectionMatrix.elements[ 14 ];

        // Calculate the scaled plane vector
        this.clipPlane.multiplyScalar( 2.0 / this.clipPlane.dot( this.q ) );

        // Replacing the third row of the projection matrix
        projectionMatrix.elements[ 2 ] = this.clipPlane.x;
        projectionMatrix.elements[ 6 ] = this.clipPlane.y;
        projectionMatrix.elements[ 10 ] = this.clipPlane.z + 1.0 - this.clipBias;
        projectionMatrix.elements[ 14 ] = this.clipPlane.w;

        // Render

        this.renderTarget.texture.colorSpace = renderer.outputColorSpace;

        this.visible = false;

        const currentRenderTarget = renderer.getRenderTarget();

        const currentXrEnabled = renderer.xr.enabled;
        const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

        renderer.xr.enabled = false; // Avoid camera modification
        renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

        renderer.setRenderTarget( this.renderTarget );

        renderer.state.buffers.depth.setMask( true ); // make sure the depth buffer is writable so it can be properly cleared, see #18897

        if ( renderer.autoClear === false ) renderer.clear();
        renderer.render( scene, this.virtualCamera );

        renderer.xr.enabled = currentXrEnabled;
        renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

        renderer.setRenderTarget( currentRenderTarget );

        // Restore viewport

        const viewport = camera.viewport;


        if ( viewport !== undefined ) {

            renderer.state.viewport( viewport );

        }

        this.visible = true;
    };

    getRenderTarget() {
        return this.renderTarget;
    };

    ReflectorShader: any = {

        uniforms: {

            'color': {
                value: null
            },

            'tDiffuse': {
                value: null
            },

            'textureMatrix': {
                value: null
            }

        },

        vertexShader: [
            'uniform mat4 textureMatrix;',
            'varying vec4 vUv;',

            'void main() {',

            '	vUv = textureMatrix * vec4( position, 1.0 );',

            '	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

            '}'
        ].join( '\n' ),

        fragmentShader: [
            'uniform vec3 color;',
            'uniform sampler2D tDiffuse;',
            'varying vec4 vUv;',

            'float blendOverlay( float base, float blend ) {',

            '	return( base < 0.5 ? ( 2.0 * base * blend ) : ( 1.0 - 2.0 * ( 1.0 - base ) * ( 1.0 - blend ) ) );',

            '}',

            'vec3 blendOverlay( vec3 base, vec3 blend ) {',

            '	return vec3( blendOverlay( base.r, blend.r ), blendOverlay( base.g, blend.g ), blendOverlay( base.b, blend.b ) );',

            '}',

            'void main() {',

            '	vec4 base = texture2DProj( tDiffuse, vUv );',
            '	gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );',

            '}'
        ].join( '\n' )
    }

}