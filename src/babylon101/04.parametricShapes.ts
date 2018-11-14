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
        // this.createLineBasic();
        // this.createDashedLines();
        // this.createSpiralLines();
        this.changeLineWithInstanceOpts();
    }

    createLineBasic(): void {
        const points = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 1, 1),
            new BABYLON.Vector3(0, 1, 0)
        ]
        BABYLON.MeshBuilder.CreateLines(
            'lines',
            {
                points
            },
            this._scene
        );
    }

    createDashedLines(): void {
        const points = [
            new BABYLON.Vector3(0, 0, 0),
            new BABYLON.Vector3(0, 1, 1),
            new BABYLON.Vector3(0, 1, 0)
        ]
        BABYLON.MeshBuilder.CreateDashedLines(
            'dashLines',
            {
                points,
                dashNb: 20
            },
            this._scene
        );
    }

    createSpiralLines(): void {
        const spiralPoints = [];
        let theta = 0; // 角度
        const deltaTheta = 0.1; // 角度增量
        let Y = 0; // 高度
        const deltaY = 0.005; // 高度增量
        const radius = 1; // 半径
        const precision = 400; // 精度

        // 创建螺旋线路径
        for (let i = 0; i < precision; i ++) {
            spiralPoints.push(
                new BABYLON.Vector3(
                    radius * Math.cos(theta),
                    Y,
                    radius * Math.sin(theta)
                )
            );
            theta += deltaTheta;
            Y += deltaY;
        }

        BABYLON.MeshBuilder.CreateLines(
            'spiralLines',
            {
                points: spiralPoints
            },
            this._scene
        );
    }

    changeLineWithInstanceOpts(): void {
        let points: Array<BABYLON.Vector3> = [];

        // instance的初始轨迹
        let theta = 0;
        const deltaTheta = 0.1;
        let Y = 0;
        const deltaY = 0.005;
        let radius = 1;
        let precision = 400;
        for (let i = 0; i < precision; i ++) {
            points.push(
                new BABYLON.Vector3(
                    radius * Math.cos(theta),
                    Y,
                    radius * Math.sin(theta)
                )
            );
            theta += deltaTheta;
            Y += deltaY;
        }

        let lines = BABYLON.MeshBuilder.CreateLines(
            'lines',
            {
                points, // 此时点集合的长度已经确定，后面instance所使用的点集合长度不能越过
                updatable: true
            },
            this._scene
        );

        // instance的更新轨迹
        points = [];
        theta = 0;
        Y = 0;
        radius = 0.5;
        precision = 200;
        for (let i = 0; i < precision; i ++) {
            points.push(
                new BABYLON.Vector3(
                    radius * Math.cos(theta),
                    Y,
                    radius * Math.sin(theta)
                )
            );
            theta += deltaTheta;
            Y += deltaY;
        }
        BABYLON.MeshBuilder.CreateLines(
            'lines',
            {
                points,
                instance: lines
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