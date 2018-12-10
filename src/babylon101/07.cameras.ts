import * as BABYLON from 'babylonjs';
import { ArcRotateCameraFixer } from '../libs/tencentTouchFixers';

// interface ICameraInput<TCamera extends BABYLON.Camera> {
//     camera: TCamera;
//     getClassName(): string;
//     getTypeName(): string;
//     getSimpleName(): string;
//     attachControl: (element: HTMLCanvasElement, noPreventDefault?: boolean) => void;
//     detachControl: (element: HTMLCanvasElement) => void;
//     checkInputs?: () => void;
// }
class FreeCameraKeyboardRotateInput implements BABYLON.ICameraInput<BABYLON.FreeCamera> {
    public camera: BABYLON.FreeCamera;
    private _keys: Array<number> = [];
    private _keysLeft: Array<number> = [37];
    private _keysRight: Array<number> = [39];
    private _sensibility: number = 0.001;
    private _onKeyDown: null | ( (e: KeyboardEvent) => void );
    private _onKeyUp: null | ( (e: KeyboardEvent) => void );
    private _onLostFocus: (e: FocusEvent) => void;

    constructor() {}

    public getClassName(): string {
        return 'FreeCamera';
    }

    public getTypeName(): string {
        return 'FreeCameraKeyboardRotateInput';
    }

    public getSimpleName(): string {
        return 'keyboardRotate';
    }

    public attachControl(element: HTMLCanvasElement, noPreventDefault?: boolean): void {
        if (!this._onKeyDown) {
            element.tabIndex = 1;
            this._onKeyDown = (event: KeyboardEvent) => {
                const { keyCode } = event;
                if (this._keysLeft.includes(keyCode) || this._keysRight.includes(keyCode)) {
                    const index = this._keys.indexOf(keyCode);
                    if (index === -1) {
                        this._keys.push(keyCode);
                    }
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            };
            this._onKeyUp = (event: KeyboardEvent) => {
                const { keyCode } = event;
                if (this._keysLeft.includes(keyCode) || this._keysRight.includes(keyCode)) {
                    const index = this._keys.indexOf(keyCode);
                    if (index >= 0) {
                        this._keys.splice(index, 1);
                    }
                    if (!noPreventDefault) {
                        event.preventDefault();
                    }
                }
            }

            element.addEventListener('keydown', this._onKeyDown, false);
            element.addEventListener('keyup', this._onKeyUp, false);
            BABYLON.Tools.RegisterTopRootEvents([
                { name: 'blur', handler: this._onLostFocus }
            ]);
        }
    }

    public detachControl(element: HTMLCanvasElement): void {
        if (this._onKeyDown) {
            element.removeEventListener('keydown', this._onKeyUp as (e: KeyboardEvent) => void);
            element.removeEventListener('keyup', this._onKeyUp as (e: KeyboardEvent) => void);
            BABYLON.Tools.RegisterTopRootEvents([
                { name: 'blue', handler: this._onLostFocus }
            ]);
            this._keys = [];
            this._onKeyDown = null;
            this._onKeyUp = null;
        }
    }

    public checkInputs(): void {
        if (this._onKeyDown) {
            this._keys.forEach(keyCode => {
                if (this._keysLeft.includes(keyCode)) {
                    this.camera.cameraRotation.y += this._sensibility;
                }
                if (this._keysRight.includes(keyCode)) {
                    this.camera.cameraRotation.y -= this._sensibility;
                }
            });
        }
    }
}

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _mesh: BABYLON.Mesh;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._scene.ambientColor = new BABYLON.Color3(1, 1, 1);
        this.createBasicEnv();
        // this.universalCamera();
        // this.arcRotateCamera();
        // this.followCamera();
        // this.anaglyphCamera();
        // this.deviceOrientationCamera();
        // this.flyCamera();
        this.customizeInputs();
    }

    private createBasicEnv(): void {
        new BABYLON.HemisphericLight('hLight', new BABYLON.Vector3(0, 1, 0), this._scene);
        new BABYLON.PointLight('pLight', new BABYLON.Vector3(10, 0, 0), this._scene);
    }

    private universalCamera(): void {
        BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        const camera = new BABYLON.UniversalCamera('ucam', new BABYLON.Vector3(0, 0, -5), this._scene);
        // camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(this._canvas, true);
    }

    private arcRotateCamera(): void {
        BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        const camera = new BABYLON.ArcRotateCamera('ucam', 0, 0, 10, new BABYLON.Vector3(0, 0, 0), this._scene);
        camera.attachControl(this._canvas, true);
    }

    private followCamera(): void {

        // 创建相机
        const camera = new BABYLON.FollowCamera(
            'fcam',
            new BABYLON.Vector3(0, 15, -30), // 起始位置
            this._scene
        );
        camera.radius = 30; // 结束位置: 远近
        camera.heightOffset = 20; // 结束位置: 高低
        camera.rotationOffset = 20; // 结束位置: 左右(x-y平面夹角)
        camera.cameraAcceleration = 0.002; // 移动加速度
        camera.maxCameraSpeed = 10; // 最大移动速度
        
        // 创建材质
        const mat = new BABYLON.StandardMaterial('texture-mtl', this._scene);
        mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 1);
        const texture = new BABYLON.Texture('assets/textures/spriteAtlas.png', this._scene);
        mat.diffuseTexture = texture;

        // 精灵图
        const faces = 6;
        let faceUV: Array<BABYLON.Vector4> = new Array(faces);
        const hSpriteNb = 6;
        const vSpriteNb = 4;
        for (let i = 0; i < faces; i ++) {
            faceUV[i] = new BABYLON.Vector4( i / hSpriteNb, 0, ( i + 1 ) / hSpriteNb, 1 / vSpriteNb );
        }

        // 创建基础盒子模型
        const box = BABYLON.MeshBuilder.CreateBox('box-texture', { size: 2, faceUV }, this._scene);
        box.material = mat;
        box.position = new BABYLON.Vector3(20, 0, 10);
        camera.lockedTarget = box; // 为followCamera锁定一个目标

        // 创建粒子系统
        const boxesSPS = new BABYLON.SolidParticleSystem('boxes', this._scene);
        const setBoxes = (particle: BABYLON.Mesh) => { // 粒子分布函数
            particle.position = new BABYLON.Vector3(
                -50 + Math.random() * 100,
                -50 + Math.random() * 100,
                -50 + Math.random() * 100
            )
        };
        boxesSPS.addShape(box, 400, { positionFunction: setBoxes });
        boxesSPS.buildMesh();

        // 目标盒子移动动画
        const orbitRadius = 20; 
        let alpha = 0;
        this._scene.registerBeforeRender(() => {
            alpha += 0.01;
            box.position = new BABYLON.Vector3(
                orbitRadius * Math.cos(alpha),
                orbitRadius * Math.sin(alpha),
                10 * Math.sin(2 * alpha)
            );
            camera.rotationOffset = ( 18 * alpha ) % 360;
        });

    }

    private anaglyphCamera(): void {
        // 3D眼镜专用相机
        BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        const camera = new BABYLON.AnaglyphUniversalCamera(
            'af_cam',
            new BABYLON.Vector3(0, 1, -15),
            0.033,
            this._scene
        );
        // const camera = new BABYLON.AnaglyphArcRotateCamera(
        //     'af_cam',
        //     -Math.PI / 4, Math.PI / 4, 10, BABYLON.Vector3.Zero(),
        //     0.033, // 观察坐标空间系数: 左右眼空间间距
        //     this._scene
        // );
        camera.attachControl(this._canvas, true);
    }

    private deviceOrientationCamera(): void {
        const redMat = new BABYLON.StandardMaterial("red", this._scene);
        redMat.diffuseColor = new BABYLON.Color3(255, 0, 0);
        redMat.emissiveColor = new BABYLON.Color3(255, 0, 0);
        redMat.specularColor = new BABYLON.Color3(255, 0, 0);
        
        const greenMat = new BABYLON.StandardMaterial("green", this._scene);
        greenMat.diffuseColor = new BABYLON.Color3(0, 255, 0);
        greenMat.emissiveColor = new BABYLON.Color3(0, 255, 0);
        greenMat.specularColor = new BABYLON.Color3(0, 255, 0);
        
        const blueMat = new BABYLON.StandardMaterial("blue", this._scene);
        blueMat.diffuseColor = new BABYLON.Color3(0, 0, 255);
        blueMat.emissiveColor = new BABYLON.Color3(0, 0, 255);
        blueMat.specularColor = new BABYLON.Color3(0, 0, 255);
        
        const yellowMat = new BABYLON.StandardMaterial("yellow", this._scene);
        yellowMat.diffuseColor = new BABYLON.Color3(255, 255, 0);
        yellowMat.emissiveColor = new BABYLON.Color3(255, 255, 0);
        yellowMat.specularColor = new BABYLON.Color3(255, 255, 0);
        
        const orangeMat = new BABYLON.StandardMaterial("orange", this._scene);
        orangeMat.diffuseColor = new BABYLON.Color3(253, 188, 3);
        orangeMat.emissiveColor = new BABYLON.Color3(253, 188, 3);
        orangeMat.specularColor = new BABYLON.Color3(253, 188, 3);
        
        const purpleMat = new BABYLON.StandardMaterial("purple", this._scene);
        purpleMat.diffuseColor = new BABYLON.Color3(255, 0, 255);
        purpleMat.emissiveColor = new BABYLON.Color3(255, 0, 255);
        purpleMat.specularColor = new BABYLON.Color3(255, 0, 255);
        
        // Shapes
        const box1 = BABYLON.MeshBuilder.CreateBox("box1", {size: 5}, this._scene);
        box1.position = new BABYLON.Vector3(0, 0, 10);
        box1.material = redMat;
        
        const box2 = BABYLON.MeshBuilder.CreateBox("box2", {size: 5}, this._scene);
        box1.position = new BABYLON.Vector3(0, 0, -10);
        box1.material = greenMat;
        
        const box3 = BABYLON.MeshBuilder.CreateBox("box3", {size: 5}, this._scene);
        box3.position = new BABYLON.Vector3(10, 0, 0);
        box3.material = blueMat;
        
        const box4 = BABYLON.MeshBuilder.CreateBox("box4", {size: 5}, this._scene);
        box4.position = new BABYLON.Vector3(-10, 0, 0);
        box4.material = yellowMat;
        
        const box5 = BABYLON.MeshBuilder.CreateBox("box5", {size: 5}, this._scene);
        box5.position = new BABYLON.Vector3(0, 10, 0);
        box5.material = orangeMat;
        
        const box6 = BABYLON.MeshBuilder.CreateBox("box6", {size: 5}, this._scene);
        box6.position = new BABYLON.Vector3(0, -10, 0);
        box6.material = purpleMat;

        const camera = new BABYLON.DeviceOrientationCamera(
            'DevOr_cam',
            new BABYLON.Vector3(0, 0, 0),
            this._scene
        );
        camera.setTarget(new BABYLON.Vector3(0, 0, 10));
        camera.attachControl(this._canvas, true);
    }

    private flyCamera(): void {
        BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        const camera = new BABYLON.FlyCamera(
            'fcam',
            new BABYLON.Vector3(0, 0, -10),
            this._scene
        );
        camera.rollCorrect = 10; // 倾斜速度: 越大修正速度越慢
        camera.bankedTurn = true; // 是否倾斜
        camera.bankedTurnLimit = Math.PI / 2; // 倾斜角度限制
        camera.bankedTurnMultiplier = 2; // 倾斜力度: 越大越明显
        camera.attachControl(this._canvas, true);
    }

    private customizeInputs(): void {
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, this._scene);
        sphere.position.y = 1;
        BABYLON.Mesh.CreateGround("ground", 4, 4, 2, this._scene);
        const camera = new BABYLON.FreeCamera('sceneCamera', new BABYLON.Vector3(0, 3, -10), this._scene);
        // const camera = new BABYLON.ArcRotateCamera('sceneCamera', Math.PI / 4, Math.PI / 4, 20, BABYLON.Vector3.Zero(), this._scene);
        // const { inputs: inputsManager } = camera;
        // ArcRotateCameraFixer(camera);
        camera.attachControl(this._canvas, true);
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

