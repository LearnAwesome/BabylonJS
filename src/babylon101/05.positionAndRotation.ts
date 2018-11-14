import * as BABYLON from 'babylonjs';

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;
    private _hLight: BABYLON.HemisphericLight;
    private _pLight: BABYLON.PointLight;
    private _mesh: BABYLON.Nullable<BABYLON.Mesh>;
    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true);
        this.createScene();
        this.createMesh();
        this.changePosition();
        this.changeRotation();
        this.changeScale();
    }
    
    createScene(): void {
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera(
            'arc-cam',
            0,
            Math.PI / 2,
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
    }

    createMesh(): void {
        const arm = BABYLON.MeshBuilder.CreateBox(
            'arm',
            {
                depth: 0.1875,
                width: 0.3,
                height: 0.75
            },
            this._scene
        );
        arm.position.x = 0.125;
        const body = BABYLON.MeshBuilder.CreateCylinder(
            'body',
            {
                height: 0.75,
                diameterTop: 0.2,
                diameterBottom: 0.5,
                tessellation: 6,
                subdivisions: 1
            },
            this._scene
        );
        this._mesh = BABYLON.Mesh.MergeMeshes(
            [body, arm],
            true
        );
    }

    changePosition(): void {
        (this._mesh as BABYLON.Mesh).position = new BABYLON.Vector3(1, 2, 3);
    }

    changeRotation(): void {
        // 设置旋转的方法
        // 方法一: 直接赋值
        (this._mesh as BABYLON.Mesh).rotation = new BABYLON.Vector3(Math.PI / 2, Math.PI / 2, Math.PI / 2);
        // 方法二: 链式序列(按照序列进行旋转)
        (this._mesh as BABYLON.Mesh)
            .addRotation(Math.PI / 2, 0, 0)
            .addRotation(0, Math.PI / 2, 0)
            .addRotation(0, 0, Math.PI / 2);
        // 方法三: 制定坐标系与坐标轴的旋转
        (this._mesh as BABYLON.Mesh).rotate(BABYLON.Axis.Y, 0.5, BABYLON.Space.LOCAL);
        // 方法四: 四元数旋转(axis, angle)
        // (this._mesh as BABYLON.Mesh).rotationQuaternion = new BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(1, 1, 1), Math.PI / 2);
    }

    changeScale(): void {
        (this._mesh as BABYLON.Mesh).scaling = new BABYLON.Vector3(0.5, 0.5, 0.5);
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