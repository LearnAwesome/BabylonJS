import * as BABYLON from 'babylonjs';
// import { arcRotateCameraFixer } from '../libs/tencentTouchFixers';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _light: BABYLON.Light;
    private _camera: BABYLON.Camera;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), this._scene);

        this.freeCameraCollisions();
    }

    private freeCameraCollisions(): void {
        // 第一人称相机与物体之间的碰撞
        this._camera = new BABYLON.FreeCamera('fcam', new BABYLON.Vector3(0, 1, -3), this._scene);
        this._camera.attachControl(this._canvas);

        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, this._scene);
        const box = BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        const boxMat = new BABYLON.StandardMaterial('box', this._scene);
        boxMat.diffuseTexture = new BABYLON.Texture('assets/textures/crate.png', this._scene);
        box.material = boxMat;
        box.position.z = 2;
        box.position.y = 0.5;

        // 应用重力系统，使相机能紧贴地面移动
        this._scene.gravity = new BABYLON.Vector3(0, -9.81, 0); // 设置重力常数
        (<BABYLON.FreeCamera>this._camera).applyGravity = true; // 应用重力

        // 应用模拟体积系统，设置碰撞检查及碰撞范围
        (<BABYLON.FreeCamera>this._camera).ellipsoid = new BABYLON.Vector3(1.2, 0.5, 1.2); // 设置椭圆体积
        this._scene.collisionsEnabled = true; // 应用体积系统
        (<BABYLON.FreeCamera>this._camera).checkCollisions = true; //碰撞检测体
        ground.checkCollisions = true; // 碰撞检测体
        box.checkCollisions = true; // 碰撞检测体

        // 其他镜头运动参数设置
        (<BABYLON.FreeCamera>this._camera).speed = 0.2; // 镜头移动速度
        (<BABYLON.FreeCamera>this._camera).angularSensibility = 3000; // 镜头旋转速度
        (<BABYLON.FreeCamera>this._camera).inertia = 0.8; // 镜头惯性
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