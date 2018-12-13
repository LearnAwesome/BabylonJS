import * as BABYLON from 'babylonjs';
import { ArcRotateCameraFixer } from '../libs/tencentTouchFixers';
import FPSMonitor from '../libs/fpsMonitor';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        
        this._canvas = <HTMLCanvasElement>document.querySelector(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        new FPSMonitor(this._scene);

        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 4, Math.PI / 2, 20, BABYLON.Vector3.Zero(), this._scene);
        ArcRotateCameraFixer(this._camera);
        this._camera.attachControl(this._canvas);

        // this.clearColor();
        // this.ambientColor();
        this.skybox();
        this.fog();
    }

    private clearColor(): void {
        this._scene.clearColor = new BABYLON.Color4(0.5, 0.8, 0.5, 1);
    }

    private ambientColor(): void {
        // 在无其他光照情况下，物体颜色 = 环境光(scene.ambientColor) * 材质环境色(material.ambientColor) * 材质自发光色(material.emissiveColor)

        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1); // 环境光设置

        const mat = new BABYLON.StandardMaterial('mat', this._scene);
        mat.ambientColor = new BABYLON.Color3(1, 0, 0); // 只有环境光不为黑色时才生效
        mat.emissiveColor = BABYLON.Color3.Blue(); // 环境光

        const box = BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        box.material = mat;
    }

    private skybox(): void {
        
        const skyboxMat = new BABYLON.StandardMaterial('skybox', this._scene);
        skyboxMat.backFaceCulling = false;
        skyboxMat.disableLighting = true;
        skyboxMat.reflectionTexture = new BABYLON.CubeTexture('assets/textures/skybox/skybox', this._scene);
        // skyboxMat.reflectionTexture = new BABYLON.CubeTexture('assets/textures/skybox/SpecularHDR.dds', this._scene);
        skyboxMat.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        
        const skybox = BABYLON.MeshBuilder.CreateBox('skybox', { size: 100 }, this._scene);
        skybox.material = skyboxMat;
        skybox.infiniteDistance = true;
        skybox.renderingGroupId = 0; // 优先渲染
    }

    private fog(): void {
        { // 烟雾浓度呈{ 指数 }增长
            // this._scene.fogMode = BABYLON.Scene.FOGMODE_EXP; // 速度慢
            // this._scene.fogMode = BABYLON.Scene.FOGMODE_EXP2; // 速度快
            // this._scene.fogDensity = 0.1; // 浓度
        }

        { // 烟雾浓度呈{ 线性 }增长        
            this._scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR; // 平均速率增长
            this._scene.fogStart = 0;
            this._scene.fogEnd = 20;
        }

        this._scene.fogColor = new BABYLON.Color3(0.9, 0.9, 0.85);

        new BABYLON.PointLight('pLight', new BABYLON.Vector3(0, 10, 0), this._scene);
        BABYLON.MeshBuilder.CreateBox('box1', {}, this._scene).position.z = 10;
        BABYLON.MeshBuilder.CreateBox('box2', {}, this._scene).position.z = 5;
        BABYLON.MeshBuilder.CreateBox('box3', {}, this._scene).position.z = 0;
        BABYLON.MeshBuilder.CreateBox('box4', {}, this._scene).position.z = -5;
        BABYLON.MeshBuilder.CreateBox('box5', {}, this._scene).position.z = -10;
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