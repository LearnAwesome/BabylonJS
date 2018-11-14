import * as BABYLON from 'babylonjs';

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _hLight: BABYLON.HemisphericLight;
    private _pLight: BABYLON.PointLight;
    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
        this.createScene();
    }
    
    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera(
            'arc-cam',
            Math.PI / 2,
            Math.PI / 2,
            2,
            new BABYLON.Vector3(0, 0, 5),
            this._scene
        );
        this._camera.attachControl(this._canvas, true);
        this._hLight = new BABYLON.HemisphericLight(
            'hLight',
            new BABYLON.Vector3(1, 1, 0),
            this._scene
        );
        this._pLight = new BABYLON.PointLight(
            'pLight',
            new BABYLON.Vector3(0, 1, -1),
            this._scene
        );
        
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            {
                diameter: 2
            },
            this._scene
        );
    }

    doRender(): void {
        this._engine.runRenderLoop(() => {
            this._scene.render();
        });
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }
}