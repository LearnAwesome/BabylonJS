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
            Math.PI / 4,
            Math.PI / 4,
            10,
            BABYLON.Vector3.Zero(),
            this._scene
        );
        this._camera.attachControl(this._canvas, true);
        this._hLight = new BABYLON.HemisphericLight(
            'hLight',
            new BABYLON.Vector3(0, 0, 0),
            this._scene
        );
        this._pLight = new BABYLON.PointLight(
            'pLight',
            new BABYLON.Vector3(-5, 5, 0),
            this._scene
        );
        // this.createBox();
        // this.createSphere();
        // this.createPlane();
        this.createGround();
    }

    createBox(): void {
        BABYLON.MeshBuilder.CreateBox(
            'box',
            {
                depth: 2, // x
                width: 2, // z
                height: 2, // y
                faceColors: [
                    new BABYLON.Color4(1, 0, 0, 1), // +x
                    new BABYLON.Color4(0, 1, 0, 1), // -x
                    new BABYLON.Color4(0, 0, 1, 1), // +z
                    new BABYLON.Color4(1, 1, 0, 1), // -z
                    new BABYLON.Color4(1, 1, 1, 1), // +y
                    new BABYLON.Color4(0, 0, 0, 1), // -y
                ]
            },
            this._scene
        );
    }

    createSphere(): void {
        BABYLON.MeshBuilder.CreateSphere(
            'sphere',
            {
                segments: 32,
                diameter: 2,
                arc: 0.6, // 经度范围
                slice: 0.4, // 维度范围
                sideOrientation: BABYLON.Mesh.DOUBLESIDE // 渲染面
            },
            this._scene
        );
    }

    createPlane(): void {
        BABYLON.MeshBuilder.CreatePlane(
            'plane',
            {
                size: 2,
                sideOrientation: BABYLON.Mesh.DOUBLESIDE
            },
            this._scene
        )
    }

    createGround(): void {
        BABYLON.MeshBuilder.CreateGround(
            'ground',
            {
                width: 6,
                height: 4,
                subdivisions: 4
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