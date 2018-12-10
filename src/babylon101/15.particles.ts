import * as BABYLON from 'babylonjs';
import { ArcRotateCameraFixer } from '../libs/tencentTouchFixers';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        this._canvas = <HTMLCanvasElement>document.querySelector(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), this._scene);
        ArcRotateCameraFixer(this._camera);
        this._camera.attachControl(this._canvas);
        new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(1, 1, 1), this._scene);
        this.basicParticles();
    }

    private basicParticles(): void {

        const fountain = BABYLON.MeshBuilder.CreateBox('fountain', {}, this._scene);
        fountain.position.y = 6;
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, this._scene);
        ground.material = <BABYLON.StandardMaterial>new BABYLON.StandardMaterial('groundMat', this._scene);
        ground.material.backFaceCulling = false;
        (<BABYLON.StandardMaterial>ground.material).diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);

        const particleSystem = new BABYLON.ParticleSystem('particles', 2000, this._scene);
        particleSystem.particleTexture = new BABYLON.Texture('assets/textures/flare.png', this._scene);

        // 创建发射源
        particleSystem.emitter = fountain;

        // 属性随机值范围设定
        { // 出现范围
            particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0);
            particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0);
        }
        { // 颜色
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1, 1); // 起始色1
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1); // 起始色2
            particleSystem.colorDead = new BABYLON.Color4(0.2, 0.5, 1, 1); // 消失前的颜色
        }
        { // 粒子大小
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
        }
        { // 生命周期
            particleSystem.minLifeTime = 0.3;
            particleSystem.maxLifeTime = 1.5;
        }
        { // 每秒发射数量
            particleSystem.emitRate = 1500;
        }
        { // 颜色混合模式
            // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE; // 自身滤色，自身不叠加，场景色不叠加，不透明
            // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_STANDARD; // 自身不滤色，自身不叠加，场景色不叠加，透明
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD; // 自身滤色，自身叠加，场景色不叠加，透明
            // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLY; // 自身不滤色，自身不叠加，场景色叠加，透明
            // particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD; // 自身不滤色，自身叠加，场景色叠加，透明
        }
        { // 发射方向
            particleSystem.direction1 = new BABYLON.Vector3(-7, 8, 3);
            particleSystem.direction2 = new BABYLON.Vector3(7, 8, -3);
        }
        { // 应用重力(影响发射方向)
            particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        }
        { // 粒子自转角速度
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
        }
        { // 发射能量(越大越远)
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
        }
        { // 粒子速度
            particleSystem.updateSpeed = 0.005;
        }

        particleSystem.start();

        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            alpha += 0.01;
            fountain.rotation = new BABYLON.Vector3(
                Math.cos(alpha),
                1,
                Math.sin(alpha)
            );
            // fountain.rotation.x = Math.cos(alpha);
            // fountain.rotation.z = Math.cos(alpha);
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