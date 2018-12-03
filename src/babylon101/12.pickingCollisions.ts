import * as BABYLON from 'babylonjs';
import { arcRotateCameraFixer } from '../libs/tencentTouchFixers';

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
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(-1, -1, 0), this._scene);
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 2, 15, BABYLON.Vector3.Zero(), this._scene);
        arcRotateCameraFixer(<BABYLON.ArcRotateCamera>this._camera);
        this._camera.attachControl(this._canvas);

        this.pickingCollisions();
    }

    private pickingCollisions(): void {
        BABYLON.MeshBuilder.CreatePlane('wall', { width: 8, height: 6 }, this._scene);
        const impact = BABYLON.MeshBuilder.CreatePlane('impact', {}, this._scene);
        const impactMat = new BABYLON.StandardMaterial('impact', this._scene);
        impactMat.diffuseTexture = new BABYLON.Texture('assets/textures/impact.png', this._scene);
        impactMat.diffuseTexture.hasAlpha = true;
        impact.material = impactMat;
        impact.position.z = -0.01;

        this._canvas.addEventListener('pointerup', () => { // 添加触发事件
            const pickedResult: BABYLON.PickingInfo = <BABYLON.PickingInfo>this._scene.pick(this._scene.pointerX, this._scene.pointerY); // 获取拾取信息
            if (pickedResult.hit) {
                const { x, y } = <BABYLON.Vector3>pickedResult.pickedPoint;
                impact.position.x = x;
                impact.position.y = y;
            }
        });
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