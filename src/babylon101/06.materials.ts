import * as BABYLON from 'babylonjs';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas);
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        this.createBasicEnv();
        // this.standardMaterial();
        // this.ambientColor();
        // this.transparency();
        // this.textures();
        // this.transparencyTextures();
        this.wireframe();
    }

    private createBasicEnv(): void {
        const camera = new BABYLON.ArcRotateCamera('arcam', - Math.PI / 2, Math.PI / 3, 5, BABYLON.Vector3.Zero(), this._scene);
        camera.attachControl(this._canvas, true);
    }

    private standardMaterial(): void {
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(5, 5, 5), this._scene);
        const mesh = BABYLON.MeshBuilder.CreateSphere('sphere', {}, this._scene);

        const material = new BABYLON.StandardMaterial('sMtl', this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 0, 0);
        material.specularColor = new BABYLON.Color3(0, 0, 1);
        // material.emissiveColor = new BABYLON.Color3(1, 1, 1);
        // material.ambientColor = new BABYLON.Color3(0.23, 0.98, 0.53);
        mesh.material = material;
    }

    private ambientColor(): void {
        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        const light = new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(-1, 1, 0), this._scene);
        light.diffuse = new BABYLON.Color3(1, 0, 0);
        light.specular = new BABYLON.Color3(0, 1, 0);
        light.groundColor = new BABYLON.Color3(0, 1, 0);

        const redMtl = new BABYLON.StandardMaterial('redMtl', this._scene);
        redMtl.ambientColor = new BABYLON.Color3(1, 0, 0);
        const greenMtl = new BABYLON.StandardMaterial('greenMtl', this._scene);
        greenMtl.ambientColor = new BABYLON.Color3(0, 1, 0);

        const sphereWithoutAmbient = BABYLON.MeshBuilder.CreateSphere('sphere-no-ambient', {}, this._scene);
        sphereWithoutAmbient.position.x = -1.5;
        const sphereWithRedAmbient = BABYLON.MeshBuilder.CreateSphere('sphere-red-ambient', {}, this._scene);
        sphereWithRedAmbient.material = redMtl;
        const sphereWithGreenAmbient = BABYLON.MeshBuilder.CreateSphere('sphere-green-ambient', {}, this._scene);
        sphereWithGreenAmbient.material = greenMtl;
        sphereWithGreenAmbient.position.x = 1.5;
    }

    private transparency(): void {
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(5, 5, 5), this._scene);

        const redOpaqueMtl = new BABYLON.StandardMaterial('red-opaque', this._scene);
        redOpaqueMtl.diffuseColor = new BABYLON.Color3(1, 0, 0);
        const greenTransparentMtl = new BABYLON.StandardMaterial('green-transparent', this._scene);
        greenTransparentMtl.diffuseColor = new BABYLON.Color3(0, 1, 0);
        greenTransparentMtl.alpha = 0.5;

        const sphere0 = BABYLON.MeshBuilder.CreateSphere('sphere0', {}, this._scene);
        sphere0.material = redOpaqueMtl;
        sphere0.position.z = 1.5;
        const sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', {}, this._scene);
        sphere1.material = greenTransparentMtl;
    }

    private textures(): void {
        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);

        const light = new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(-1, 1, 0), this._scene);
        light.diffuse = new BABYLON.Color3(1, 0, 0);
        light.specular = new BABYLON.Color3(0, 1, 0);
        light.groundColor = new BABYLON.Color3(0, 1, 0);

        const diffuseTextureMtl = new BABYLON.StandardMaterial('diffuse', this._scene);
        diffuseTextureMtl.diffuseTexture = new BABYLON.Texture('assets/textures/grass.png', this._scene);
        const emissiveTextureMtl = new BABYLON.StandardMaterial('emissive', this._scene);
        emissiveTextureMtl.emissiveTexture = new BABYLON.Texture('assets/textures/grass.png', this._scene);
        const diffuseColorAmbientTextureMtl = new BABYLON.StandardMaterial('diffuse-ambient', this._scene);
        diffuseColorAmbientTextureMtl.diffuseColor = new BABYLON.Color3(1, 0, 0);
        diffuseColorAmbientTextureMtl.ambientTexture = new BABYLON.Texture('assets/textures/grass.png', this._scene);

        const sphereWithDiffuseTexture = BABYLON.MeshBuilder.CreateSphere('sphere-diffuse-texture', {}, this._scene);
        sphereWithDiffuseTexture.material = diffuseTextureMtl;
        sphereWithDiffuseTexture.position.x = -1.5;
        const sphereWithEmissiveTexture = BABYLON.MeshBuilder.CreateSphere('sphere-emissive-texture', {}, this._scene);
        sphereWithEmissiveTexture.material = emissiveTextureMtl;
        const sphereWithDiffuseColorEmissiveTexture = BABYLON.MeshBuilder.CreateSphere('sphere-diffuse-emissive-texture', {}, this._scene);
        sphereWithDiffuseColorEmissiveTexture.material = diffuseColorAmbientTextureMtl;
        sphereWithDiffuseColorEmissiveTexture.position.x = 1.5;
    }

    private transparencyTextures(): void {
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(5, 5, 5), this._scene);

        const mtl = new BABYLON.StandardMaterial('mtl', this._scene);
        mtl.diffuseTexture = new BABYLON.Texture('assets/textures/dog.png', this._scene);
        mtl.diffuseTexture.hasAlpha = true; // 贴图是否含有透明区域
        mtl.backFaceCulling = false; // 反面剔除
        const box = BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        box.material = mtl;
    }

    private wireframe(): void {
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(5, 5, 5), this._scene);
        const mtl = new BABYLON.StandardMaterial('mtl', this._scene);
        mtl.wireframe = true;
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {
            segments: 16
        }, this._scene);
        sphere.material = mtl;
    }

    public doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

}