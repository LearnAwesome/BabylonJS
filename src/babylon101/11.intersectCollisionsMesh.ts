import * as BABYLON from 'babylonjs';
import { ArcRotateCameraFixer } from '../libs/tencentTouchFixers';

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
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 2, 30, BABYLON.Vector3.Zero(), this._scene);
        ArcRotateCameraFixer(<BABYLON.ArcRotateCamera>this._camera);
        this._camera.attachControl(this._canvas);

        this.meshCollisions();
    }

    private meshCollisions(): void {
        // [物体-物体]或[物体-点]碰撞判断

        const planeMat = new BABYLON.StandardMaterial('planeMat', this._scene);
        planeMat.emissiveColor = new BABYLON.Color3(0, 1, 0);
        planeMat.backFaceCulling = false;
        const bbMat = new BABYLON.StandardMaterial('bb', this._scene);
        bbMat.wireframe = true;

        const sphere1 = BABYLON.MeshBuilder.CreateSphere('sphere1', {}, this._scene);
        sphere1.material = new BABYLON.StandardMaterial('sphereMat', this._scene);
        sphere1.position.x = - 10;
        const sphere2 = BABYLON.MeshBuilder.CreateSphere('sphere2', {}, this._scene);
        sphere2.material = new BABYLON.StandardMaterial('sphereMat', this._scene);
        const sphere3 = BABYLON.MeshBuilder.CreateSphere('sphere3', {}, this._scene);
        sphere3.material = new BABYLON.StandardMaterial('sphereMat', this._scene);
        sphere3.position.x = 10;

        const plane1 = BABYLON.MeshBuilder.CreatePlane('plane1', { width: 8, height: 4 }, this._scene);
        plane1.material = planeMat;
        plane1.rotation.x = Math.PI / 4;
        plane1.position.x = - 10;
        const plane2 = BABYLON.MeshBuilder.CreatePlane('plane2', { width: 8, height: 4 }, this._scene);
        plane2.material = planeMat;
        plane2.rotation.x = Math.PI / 4;
        const point = BABYLON.MeshBuilder.CreateSphere('point', { diameter: 0.1 }, this._scene);
        point.material = planeMat;
        point.position.x = 10;

        // AABB包围盒(忽略旋转)
        const aabb = BABYLON.MeshBuilder.CreateBox('aabb', {
            width: 8,
            height: Math.sin(Math.PI / 4) * 4,
            depth: Math.cos(Math.PI / 4) * 4
        });
        aabb.material = bbMat;
        aabb.rotation.x = - Math.PI / 4;
        aabb.parent = plane1;

        // OBB包围盒(计算旋转状态)
        const obb = BABYLON.MeshBuilder.CreateBox('obb', {
            width: 8,
            height: 0.05,
            depth: 4
        });
        obb.material = bbMat;
        obb.rotation.x = - Math.PI / 2;
        obb.parent = plane2;

        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            alpha += 0.02;
            const positionY = Math.sin(alpha) * 3;
            sphere1.position.y = positionY;
            sphere2.position.y = positionY;
            sphere3.position.y = positionY;

            // [物体-物体]碰撞判断
            if (plane1.intersectsMesh(sphere1, false)) { // false表示AABB包围盒算法
                (<BABYLON.StandardMaterial>sphere1.material).diffuseColor = new BABYLON.Color3(1, 0, 0);
            } else {
                (<BABYLON.StandardMaterial>sphere1.material).diffuseColor = new BABYLON.Color3(1, 1, 1);
            }

            // [物体-物体]碰撞判断
            if (plane2.intersectsMesh(sphere2, true)) { // true表示OBB包围盒算法
                (<BABYLON.StandardMaterial>sphere2.material).diffuseColor = new BABYLON.Color3(1, 0, 0);
            } else {
                (<BABYLON.StandardMaterial>sphere2.material).diffuseColor = new BABYLON.Color3(1, 1, 1);
            }

            // [物体-点]碰撞判断
            if (sphere3.intersectsPoint(point.position)) {
                (<BABYLON.StandardMaterial>sphere3.material).diffuseColor = new BABYLON.Color3(1, 0, 0);
            } else {
                (<BABYLON.StandardMaterial>sphere3.material).diffuseColor = new BABYLON.Color3(1, 1, 1);
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