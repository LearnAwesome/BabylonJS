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
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this._scene);
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 4, 30, BABYLON.Vector3.Zero(), this._scene);
        ArcRotateCameraFixer(<BABYLON.ArcRotateCamera>this._camera);
        this._camera.attachControl(this._canvas);
        
        // this.basicRay();
        // this.multiPickRay();
        this.rayHelper();
    }

    private basicRay(): void {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this._scene);
        ground.material = new BABYLON.StandardMaterial('ground', this._scene);
        (<BABYLON.StandardMaterial>ground.material).alpha = 0;

        const originBox = BABYLON.MeshBuilder.CreateBox('origin', { width: 1, height: 1, depth: 2 }, this._scene);
        originBox.material = new BABYLON.StandardMaterial('origin', this._scene);
        (<BABYLON.StandardMaterial>originBox.material).diffuseColor = new BABYLON.Color3(0, 0, 0);
        (<BABYLON.StandardMaterial>originBox.material).alpha = 0.4;
        originBox.isPickable = false;
        const rayLine = BABYLON.MeshBuilder.CreateLines('line', {
            points: [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, 20) ],
            colors: [ new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 0) ] // 渐变
        }, this._scene);
        rayLine.parent = originBox;

        const box1 = BABYLON.MeshBuilder.CreateBox('box1', {}, this._scene);
        box1.material = new BABYLON.StandardMaterial('box1', this._scene);
        (<BABYLON.StandardMaterial>box1.material).diffuseColor = new BABYLON.Color3(0, 1, 0);
        box1.position.z = 4;

        const box4 = BABYLON.MeshBuilder.CreateBox('box4', { width: 0.5, height: 0.5, depth: 3 }, this._scene);
        box4.material = new BABYLON.StandardMaterial('box4', this._scene);
        (<BABYLON.StandardMaterial>box4.material).diffuseColor = new BABYLON.Color3(1, 1, 1);
        box4.position.z = 4.5;

        const box2 = box1.clone();
        box2.material = box1.material.clone('box2');
        (<BABYLON.StandardMaterial>box2.material).diffuseColor = new BABYLON.Color3(1, 1, 0);
        box2.position.z = 8;

        const box3 = box1.clone();
        box3.material = box1.material.clone('box3');
        (<BABYLON.StandardMaterial>box3.material).diffuseColor = new BABYLON.Color3(0, 0, 1);
        box3.position.x = 4;

        // 射线指向鼠标位置
        const _pointermoveFn = (): void => {
            const pickResult: BABYLON.PickingInfo = <BABYLON.PickingInfo>this._scene.pick(this._scene.pointerX, this._scene.pointerY);
            if (pickResult.hit) {
                const { x, z } = <BABYLON.Vector3>pickResult.pickedPoint; // 从平面XY转换成三维XYZ坐标
                // 在XoZ平面求夹角
                const diffX = x - originBox.position.x;
                const diffY = z - originBox.position.z;
                originBox.rotation.y = Math.atan2(diffX, diffY); // 反正切
            }
        };

        // 向量转换为local坐标系
        const _vecToLoacl = (vector: BABYLON.Vector3, mesh: BABYLON.Mesh): BABYLON.Vector3 => {
            const matrix = mesh.getWorldMatrix(); // 获得物体的矩阵(世界坐标系)
            return BABYLON.Vector3.TransformCoordinates(vector, matrix); // 使用指定的矩阵转换当前三维向量
        };

        const _castRay = (): void => {
            const origin = originBox.position;
            let forward = BABYLON.Vector3.Forward(); // vec3(0, 0, 1)
            forward = _vecToLoacl(forward, originBox);
            let direction = forward.subtract(origin); // 向量减法
            direction = BABYLON.Vector3.Normalize(direction); // 向量归一化
            const length = 100;
            // 创建射线
            const ray = new BABYLON.Ray(
                origin, // 原点坐标
                direction, // 方向向量
                length // 射线长度
            );
            const hit = <BABYLON.PickingInfo>this._scene.pickWithRay(
                ray, // 射线
                undefined, // 过滤函数(会忽略mesh.isPickable:false的属性)，
                true // 以[包围盒false / 中心位置true]方式确定射线序列中的第一个物体
            ); // 通过射线拾取
            if (hit.pickedMesh) {
                hit.pickedMesh.scaling.y += 0.01;
            }
        };

        this._scene.onBeforeRenderObservable.add(() => {
            _castRay();
        });
        
        this._scene.onPointerMove = () => {
            _pointermoveFn();
        };
    }

    private multiPickRay(): void {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 100, height: 100 }, this._scene);
        ground.material = new BABYLON.StandardMaterial('ground', this._scene);
        (<BABYLON.StandardMaterial>ground.material).alpha = 0;

        const originBox = BABYLON.MeshBuilder.CreateBox('origin', { width: 1, height: 1, depth: 2 }, this._scene);
        originBox.material = new BABYLON.StandardMaterial('origin', this._scene);
        (<BABYLON.StandardMaterial>originBox.material).diffuseColor = new BABYLON.Color3(0, 0, 0);
        (<BABYLON.StandardMaterial>originBox.material).alpha = 0.4;
        originBox.isPickable = false;
        const rayLine = BABYLON.MeshBuilder.CreateLines('line', {
            points: [ BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, 20) ],
            colors: [ new BABYLON.Color4(1, 0, 0, 1), new BABYLON.Color4(1, 0, 0, 0) ] // 渐变
        }, this._scene);
        rayLine.parent = originBox;

        const box1 = BABYLON.MeshBuilder.CreateBox('box1', {}, this._scene);
        box1.material = new BABYLON.StandardMaterial('box1', this._scene);
        (<BABYLON.StandardMaterial>box1.material).diffuseColor = new BABYLON.Color3(0, 1, 0);
        box1.position.z = 4;

        const box2 = box1.clone();
        box2.material = box1.material.clone('box2');
        (<BABYLON.StandardMaterial>box2.material).diffuseColor = new BABYLON.Color3(1, 1, 0);
        box2.position.z = 8;

        const box3 = box1.clone();
        box3.material = box1.material.clone('box3');
        (<BABYLON.StandardMaterial>box3.material).diffuseColor = new BABYLON.Color3(0, 0, 1);
        box3.position.x = 4;

        // 射线指向鼠标位置
        const _pointermoveFn = (): void => {
            const pickResult: BABYLON.PickingInfo = <BABYLON.PickingInfo>this._scene.pick(this._scene.pointerX, this._scene.pointerY);
            if (pickResult.hit) {
                const { x, z } = <BABYLON.Vector3>pickResult.pickedPoint; // 从平面XY转换成三维XYZ坐标
                // 在XoZ平面求夹角
                const diffX = x - originBox.position.x;
                const diffY = z - originBox.position.z;
                originBox.rotation.y = Math.atan2(diffX, diffY); // 反正切
            }
        };

        // 向量转换为local坐标系
        const _vecToLoacl = (vector: BABYLON.Vector3, mesh: BABYLON.Mesh): BABYLON.Vector3 => {
            const matrix = mesh.getWorldMatrix(); // 获得物体的矩阵(世界坐标系)
            return BABYLON.Vector3.TransformCoordinates(vector, matrix); // 使用指定的矩阵转换当前三维向量
        };

        const _castRay = (): void => {
            const origin = originBox.position;
            let forward = BABYLON.Vector3.Forward(); // vec3(0, 0, 1)
            forward = _vecToLoacl(forward, originBox);
            let direction = forward.subtract(origin); // 向量减法
            direction = BABYLON.Vector3.Normalize(direction); // 向量归一化
            const length = 100;
            // 创建射线
            const ray = new BABYLON.Ray(
                origin, // 原点坐标
                direction, // 方向向量
                length // 射线长度
            );
            const hits = <BABYLON.PickingInfo[]>this._scene.multiPickWithRay(
                ray, // 射线
                mesh => {
                    if (mesh == originBox) {
                        return false;
                    }
                    return true;
                }, // 过滤函数(会忽略mesh.isPickable:false的属性)
            ); // 通过射线多重拾取
            hits.forEach(hit => {
                if (hit.pickedMesh) {
                    hit.pickedMesh.scaling.y += 0.01;
                }
            });
        };

        this._scene.onBeforeRenderObservable.add(() => {
            _castRay();
        });
        
        this._scene.onPointerMove = () => {
            _pointermoveFn();
        };
    }

    private rayHelper(): void {
        const originBox = BABYLON.MeshBuilder.CreateBox('origin', { width: 0.5, height: 0.5, depth: 1 }, this._scene);
        originBox.material = new BABYLON.StandardMaterial('origin', this._scene);
        (<BABYLON.StandardMaterial>originBox.material).diffuseColor = new BABYLON.Color3(0, 0, 0);
        (<BABYLON.StandardMaterial>originBox.material).alpha = 0.4;
        originBox.isPickable = false;

        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 6 }, this._scene);
        sphere.material = new BABYLON.StandardMaterial('sphere', this._scene);
        (<BABYLON.StandardMaterial>sphere.material).diffuseColor = new BABYLON.Color3(0, 1, 0);
        sphere.position.z = 8;
        sphere.showBoundingBox = true;

        const planeMat = new BABYLON.StandardMaterial('plane', this._scene);
        planeMat.diffuseColor = BABYLON.Color3.Red();
        planeMat.backFaceCulling = false;

        const ray = new BABYLON.Ray(BABYLON.Vector3.Zero(), BABYLON.Vector3.Forward());
        const rayHelper = new BABYLON.RayHelper(ray);
        rayHelper.attachToMesh(originBox, BABYLON.Vector3.Forward(), new BABYLON.Vector3(0, 0, 1), 20);
        rayHelper.show(this._scene, BABYLON.Color3.Red());

        let plane: BABYLON.Mesh;
        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            originBox.rotation.y = Math.sin(alpha += 0.01);
            const pickResult = ray.intersectsMesh(sphere);
            if (pickResult.hit) {
                const mesh: BABYLON.Mesh = <BABYLON.Mesh>pickResult.pickedMesh;
                const { faceId } = pickResult; // 获取面片id
                const position = <BABYLON.Vector3>pickResult.pickedPoint; // 获取射线于面片交点坐标
                const normal = mesh.getFacetNormal(faceId); // 获取面片法线
                const parallel = BABYLON.Plane.FromPositionAndNormal(position, normal); // 根据交点坐标与法线生成面(平行面)
                // 清除旧面
                const oldPlane = this._scene.getMeshByName('plane');
                if (oldPlane) {
                    this._scene.removeMesh(oldPlane);
                    oldPlane.dispose();
                }
                
                // 通过sourcePlane:平行面生成新的plane
                plane = BABYLON.MeshBuilder.CreatePlane('plane', { size: 1, sourcePlane: parallel }, this._scene);
                plane.material = planeMat;
                plane.position.copyFrom(<BABYLON.Vector3>pickResult.pickedPoint);
            } else {
                const oldPlane = this._scene.getMeshByName('plane');
                if (oldPlane) {
                    this._scene.removeMesh(oldPlane);
                    oldPlane.dispose();
                }
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