import * as BABYLON from 'babylonjs';
import { arcRotateCameraFixer } from '../libs/tencentTouchFixers';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _light: BABYLON.Light;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(10, 10, 10), this._scene);
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 4, Math.PI / 4, 80, BABYLON.Vector3.Zero(), this._scene);
        arcRotateCameraFixer(this._camera);
        this._camera.attachControl(this._canvas);
        
        // this.basicAnimation();
        // this.controllingAnimations();
        // this.helperFunction();
        // this.animationWeights();
        // this.easingFunctions();
        // this.complexAnimation();
        this.attachAnimationEvents();
    }

    private async basicAnimation(): Promise<any> {
        const box1 = BABYLON.MeshBuilder.CreateBox('box1', { size: 10 }, this._scene);
        box1.position.x = - 20;

        // 初始化运动
        const scaleXAnimation = new BABYLON.Animation(
            'scaleX', // 运动名称(不限)
            'scaling.x', // 作用于运动物体的属性
            20, // FPS(也可以理解为运动速度)
            BABYLON.Animation.ANIMATIONTYPE_FLOAT, // 变化类型(数字、向量、四元数、矩阵、颜色)
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE // 循环类型(恢复、循环、终点停止)
        );

        // 组合关键帧
        interface IFloatKeyframe {
            frame: number;
            value: number;
        }
        const scaleXKeys: Array<IFloatKeyframe> = [];
        scaleXKeys.push({ frame: 0, value: 1 });
        scaleXKeys.push({ frame: 20, value: 0.2 });
        scaleXKeys.push({ frame: 100, value: 1 });

        // 运动队列与填充关键帧
        scaleXAnimation.setKeys(scaleXKeys); // 填充运动关键帧
        // box1.animations = []; // 初始化物体运动队列
        // box1.animations.push(scaleXAnimation); // 填充物体运动队列

        // 设置(获得)运动对象并开始运动
        // const animatable = this._scene.beginAnimation(
        //     box1, // 运动目标物体
        //     0, // 起始帧数(也可以设置为结束时的帧数100，来逆序播放)
        //     100, // 结束帧数(也可以设置为起始时的帧数0，来逆序播放)(超过最大关键帧时按最大关键帧计算)
        //     true, // 是否循环(只有loopMode为BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE时才有效)
        //     1, // 速度比率(默认为1，正比关系)
        //     () => { console.log('end') } // 结束回调(只有在是否循环为false才执行)
        // );

        // 运动对象操作方法
        // animatable.pause(); // 暂停
        // animatable.restart(); // 重新开始
        // animatable.stop(); // 完全停止
        // animatable.reset(); // 重置
        // const targetAnimatable = this._scene.getAnimatableByTarget(box1); // 通过scene以及target来获得运动对象
        // console.log(animatable === targetAnimatable); // true

        // 自由组合运动
        // 多个animation同时进行
        box1.animations = [];
        box1.animations.push(scaleXAnimation);

        const positionAnimation = new BABYLON.Animation(
            'positionChange',
            'position',
            20,
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        interface IVector3Keyframe {
            frame: number;
            value: BABYLON.Vector3;
        }
        const positionKeys: Array<IVector3Keyframe> = [];
        positionKeys.push({ frame: 0, value: new BABYLON.Vector3(0, 0, 0) });
        positionKeys.push({ frame: 20, value: new BABYLON.Vector3(10, 10, 10) });
        positionKeys.push({ frame: 100, value: new BABYLON.Vector3(0, 0, 0) });
        positionAnimation.setKeys(positionKeys);
        box1.animations.push(positionAnimation);

        const animatable = this._scene.beginAnimation(
            box1,
            0,
            100,
            true // loop
        )

        // 可以通过Promise方式介入运动过程
        console.log('before');
        await animatable.waitAsync();
        console.log('after'); // loop为false的时候才会进入结束阶段

    }

    private controllingAnimations(): void {

        // 介入运动的每一帧变化（全局更改，慎用）
        BABYLON.Animation.prototype.color3InterpolateFunction = (start, end, gradient): any => {
            return BABYLON.Color3.Lerp(start, end, gradient * 2);
        };

        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 4 }, this._scene);
        const material = new BABYLON.StandardMaterial('mat', this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        sphere.material = material;

        const colorChange = new BABYLON.Animation(
            'color',
            'material.diffuseColor',
            30,
            BABYLON.Animation.ANIMATIONTYPE_COLOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        interface IColor3Keyframe {
            frame: number;
            value: BABYLON.Color3;
        }
        const keys: Array<IColor3Keyframe> = [];
        keys.push({ frame: 0, value: new BABYLON.Color3(1, 1, 1) });
        keys.push({ frame: 30, value: new BABYLON.Color3(1, 0, 0) });
        keys.push({ frame: 100, value: new BABYLON.Color3(1, 1, 1) });
        colorChange.setKeys(keys);

        sphere.animations = [];
        sphere.animations.push(colorChange);

        this._scene.beginAnimation(
            sphere,
            0,
            100,
            true
        );

    }

    public helperFunction(): void {
        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 4 }, this._scene);
        sphere.material = new BABYLON.StandardMaterial('mat', this._scene);
        // 快速创建并开始动画，返回Animatable对象
        // 只能适用于线性变化的简单运动
        // 可以同时存在多个
        BABYLON.Animation.CreateAndStartAnimation(
            'zoom',
            sphere,
            'material.diffuseColor',
            30,
            100,
            new BABYLON.Color3(1, 1, 1), // 开始状态
            new BABYLON.Color3(0, 0, 0), // 结束状态
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        BABYLON.Animation.CreateAndStartAnimation(
            'translate',
            sphere,
            'position',
            30,
            100,
            new BABYLON.Vector3(0, 0, 0), // 开始状态
            new BABYLON.Vector3(10, 10, 10), // 结束状态
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
    }

    private animationWeights(): void {
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 8 }, this._scene);
        box.material = new BABYLON.StandardMaterial('mat', this._scene);
        box.animations = [];

        interface IKeyframe {
            frame: number;
            value: BABYLON.Vector3;
        }
        const scaleAnimation = new BABYLON.Animation('scale', 'scaling', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const scaleKeys: Array<IKeyframe> = [];
        scaleKeys.push({ frame: 0, value: new BABYLON.Vector3(1, 1, 1) });
        scaleKeys.push({ frame: 90, value: new BABYLON.Vector3(0.5, 1, 1) });
        scaleKeys.push({ frame: 120, value: new BABYLON.Vector3(0.5, 0.5, 1) });
        scaleAnimation.setKeys(scaleKeys);
        box.animations.push(scaleAnimation);

        const zoomIn = this._scene.beginWeightedAnimation(
            box,
            0, 90,
            0, // 运动比重
            true
        );
        const zoomOut = this._scene.beginWeightedAnimation(
            box,
            91, 120,
            0, // 运动比重
            true
        );

        // 也可以随时更改Animatable的比重
        zoomIn.weight = 1;
        zoomOut.weight = 1;
        
        // 如果两种运动的总时间不同，可以用同步命令来缩放其中一种运动的总时间
        zoomOut.syncWith(zoomIn);
    }

    private easingFunctions(): void {
        // 使用内置缓动函数
        const torus1 = BABYLON.MeshBuilder.CreateTorus('torus1', { diameter: 8 }, this._scene);
        torus1.animations = [];
        torus1.position = new BABYLON.Vector3(-8, 0, -8);
        const animation1 = new BABYLON.Animation('anim', 'position', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys1 = [];
        keys1.push({ frame: 0, value: torus1.position });
        keys1.push({ frame: 120, value: torus1.position.add(new BABYLON.Vector3(0, 30, 0)) } );
        animation1.setKeys(keys1);
        torus1.animations.push(animation1);
        const easingFunction1 = new BABYLON.CircleEase(); // 缓动类型
        easingFunction1.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT); // 缓动方向
        animation1.setEasingFunction(easingFunction1);
        this._scene.beginAnimation(torus1, 0, 120, true);

        // 使用贝塞尔曲线
        // http://cubic-bezier.com
        const torus2 = BABYLON.MeshBuilder.CreateTorus('torus2', { diameter: 8 }, this._scene);
        torus1.position = new BABYLON.Vector3(-8, 0, -8);
        torus2.animations = [];
        const animation2 = new BABYLON.Animation('anim', 'position', 30, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys2 = [];
        keys2.push({ frame: 0, value: torus2.position });
        keys2.push({ frame: 120, value: torus2.position.add(new BABYLON.Vector3(0, 30, 0)) });
        animation2.setKeys(keys2);
        torus2.animations.push(animation2);
        const easingFunction2 = new BABYLON.BezierCurveEase(0.32, -0.73, 0.69, 1.59); // 贝塞尔曲线
        animation2.setEasingFunction(easingFunction2);
        this._scene.beginAnimation(torus2, 0, 120, true);
    }

    private complexAnimation(): void {
        // 类似于renderLoop游戏循环，适用于复杂的运动
        // scene.registerBeforeRender(animationLoopFunction) 与 scene.onBeforeRenderObserver.add(animationLoopFunction) 作用相同
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 8 }, this._scene);

        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            alpha += 0.01;
            box.position = new BABYLON.Vector3(
                Math.cos(alpha * Math.PI) * 20,
                0,
                Math.sin(alpha * Math.PI) * 20,
            );
            box.rotation = new BABYLON.Vector3(
                alpha,
                alpha,
                alpha
            );
        });
    }

    private attachAnimationEvents(): void {
        const box = BABYLON.MeshBuilder.CreateBox('box', { size: 8 }, this._scene);
        const animation = new BABYLON.Animation('rise', 'position.y', 30, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        const keys = [
            { frame: 0, value: 0 },
            { frame: 100, value: 20 },
        ];
        animation.setKeys(keys);
        box.animations = [animation];

        // 必须在运动触发(beginAnimation)之前设置
        const animationEvent = new BABYLON.AnimationEvent(
            50, // 触发帧数设置
            (currentFrame: number) => { // 钩子函数
                // console.log(currentFrame); // 触发时的帧数，比设置的触发帧数晚不到半帧
                box.rotation.y += Math.PI / 4;
            },
            false // 是否只处罚一次
        );
        animation.addEvent(animationEvent); // 插入事件

        this._scene.beginAnimation(box, 0, 100, true);
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