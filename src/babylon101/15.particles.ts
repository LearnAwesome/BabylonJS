import * as BABYLON from 'babylonjs';
import { ArcRotateCameraFixer } from '../libs/tencentTouchFixers';
import FPSMonitor from '../libs/fpsMonitor';

export default class Game {

    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        
        this._canvas = <HTMLCanvasElement>document.querySelector(canvasElement);
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        new FPSMonitor(this._scene);

        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 4, 50, BABYLON.Vector3.Zero(), this._scene);
        ArcRotateCameraFixer(this._camera);
        this._camera.attachControl(this._canvas);
        new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(1, 1, 1), this._scene);

        // this.basicParticles();
        // this.preWarming();
        // this.spriteParticles();
        // this.velocity();
        // this.particleHelper();
        // this.dragFactor();
        // this.ramp();
        // this.noiseTexture();
        this.gpuParticles();
    }

    private basicParticles(): void {

        const fountain = BABYLON.MeshBuilder.CreateBox('fountain', {}, this._scene);
        fountain.position.y = 6;
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 50, height: 50 }, this._scene);
        ground.material = <BABYLON.StandardMaterial>new BABYLON.StandardMaterial('groundMat', this._scene);
        ground.material.backFaceCulling = false;
        (<BABYLON.StandardMaterial>ground.material).diffuseColor = new BABYLON.Color3(0.3, 0.3, 1);

        // 创建粒子系统
        const particleSystem = new BABYLON.ParticleSystem(
            'particles',
            2000, // 负载能力
            this._scene
        );

        // 粒子贴图
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
        { // 粒子初始旋转角
            particleSystem.minInitialRotation = -2 * Math.PI;
            particleSystem.maxInitialRotation = 2 * Math.PI;
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
        { // 粒子是否始终面向相机位置(粒子法线 = vec相机位置 - vec粒子位置)
            particleSystem.isBillboardBased = true;
            // particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_ALL;
            // particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_STRETCHED;
            // particleSystem.billboardMode = BABYLON.ParticleSystem.BILLBOARDMODE_Y;
        }
        { // 粒子系统运行总时间
            particleSystem.targetStopDuration = 0.5;
            particleSystem.disposeOnStop = true; // 结束时销毁(用于一次性粒子系统)
        }

        // 启动粒子系统
        particleSystem.start(
            0 // 延迟
        );

        // let alpha = 0;
        // this._scene.onBeforeRenderObservable.add(() => {
        //     alpha += 0.01;
        //     fountain.rotation = new BABYLON.Vector3(
        //         Math.cos(alpha),
        //         1,
        //         Math.sin(alpha)
        //     );
        // });

    }

    private preWarming(): void {
        this._camera.radius = 10;

        const particleSystem = new BABYLON.ParticleSystem('sunSurface', 1600, this._scene);
        particleSystem.particleTexture = new BABYLON.Texture('assets/textures/sunSurface.png', this._scene);

        const coreSphere = BABYLON.MeshBuilder.CreateSphere('core', { diameter: 2.01, segments: 64 }, this._scene);
        coreSphere.material = new BABYLON.StandardMaterial('coreMat', this._scene);
        (<BABYLON.StandardMaterial>coreSphere.material).emissiveColor = new BABYLON.Color3(0.3773, 0.0930, 0.0266);

        const sunEmitter = new BABYLON.SphereParticleEmitter(
            1.05, // 半径
            0.05 // 随机范围(从圆周到圆心)
        );

        particleSystem.emitter = coreSphere;
        particleSystem.particleEmitterType = sunEmitter;
        
        particleSystem.emitRate = 100;

        particleSystem.minSize = 0.4;
        particleSystem.maxSize = 0.7;
        
        { // 颜色梯度
            particleSystem.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
            particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5));
            particleSystem.addColorGradient(0.5, new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.5));
            particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));
        }

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

        particleSystem.minLifeTime = 8;
        particleSystem.maxLifeTime = 8;

        particleSystem.minInitialRotation = -2 * Math.PI;
        particleSystem.maxInitialRotation = 2 * Math.PI;

        particleSystem.minAngularSpeed = -0.4;
        particleSystem.maxAngularSpeed = 0.4;

        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.updateSpeed = 0.005;

        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        particleSystem.isBillboardBased = false;

        { // 粒子预热
            particleSystem.preWarmCycles = 50; // 预热循环次数
            particleSystem.preWarmStepOffset = 10; // 预热速度(真实时间的倍数)
        }
        
        particleSystem.start();

    }

    private spriteParticles(): void {
        this._camera.radius = 5;
        const mat = new BABYLON.StandardMaterial('mat', this._scene);
        mat.diffuseColor = new BABYLON.Color3(0.3773, 0.0930, 0.0266);
        const fountain = BABYLON.MeshBuilder.CreateCylinder('fountain', { height: 0.1, diameter: 0.2 }, this._scene);
        fountain.position.y = 0.5;
        fountain.material = mat;
        const cup = BABYLON.MeshBuilder.CreateCylinder('cup', { height: 1, diameter: 0.9 }, this._scene);
        cup.material = mat;
        const child = new BABYLON.TransformNode('child');
        child.parent = fountain;
        child.position.y = 0.5;

        const particleSystem = new BABYLON.ParticleSystem(
            'steam',
            30,
            this._scene,
            null, // 自定义shader效果
            true // 启用spriteSheet动画
        );
        
        // 关于MipMap以及Sampling相关文章: https://smartblack.iteye.com/blog/762948
        particleSystem.particleTexture = new BABYLON.Texture(
            'assets/textures/steamSpriteSheet.png',
            this._scene,
            true, // MipMap关闭多级纹理
            false, // y轴翻转
            // BABYLON.Texture.BILINEAR_SAMPLINGMODE // 纹理采样模式(Nearest最近点采样 | Bilinear双线性过滤 | Trilinear三线性过滤)
        );

        { // 精灵图动画设置
            particleSystem.startSpriteCellID = 0; // 起始位置
            particleSystem.endSpriteCellID = 31; // 结束位置
            particleSystem.spriteCellWidth = 128; // 宽度
            particleSystem.spriteCellHeight = 256; // 高度
            particleSystem.spriteCellChangeSpeed = 3; // 播放速度
        }

        particleSystem.minScaleY = 2;
        particleSystem.maxScaleY = 2;

        particleSystem.addSizeGradient(0, 0);
        particleSystem.addSizeGradient(1, 1);

        particleSystem.minLifeTime = 2;
        particleSystem.maxLifeTime = 3;

        particleSystem.addColorGradient(0, new BABYLON.Color4(1, 1, 1, 0));
        particleSystem.addColorGradient(0.5, new BABYLON.Color4(1, 1, 1, 70/255));
        particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

        particleSystem.emitRate = 6;

        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.updateSpeed = 0.015;

        particleSystem.translationPivot = new BABYLON.Vector2(0, -0.5);

        particleSystem.billboardMode = BABYLON.AbstractMesh.BILLBOARDMODE_Y;

        const coneEmitter = new BABYLON.ConeParticleEmitter(0.4, Math.PI);
        particleSystem.particleEmitterType = coneEmitter;
        particleSystem.emitter = <BABYLON.AbstractMesh>child;

        particleSystem.start();
        
    }

    private velocity(): void {
        this._camera.radius = 20;

        const fountain = BABYLON.MeshBuilder.CreateSphere('fountain', {diameter: 0.5}, this._scene);
        fountain.material = new BABYLON.StandardMaterial('mat', this._scene);
        (<BABYLON.StandardMaterial>fountain.material).emissiveColor = new BABYLON.Color3(0.2, 0.5, 1);
        
        const particleSystem = new BABYLON.ParticleSystem('particle', 2000, this._scene);
        particleSystem.particleTexture = new BABYLON.Texture('assets/textures/flare.png', this._scene);

        particleSystem.particleEmitterType = new BABYLON.SphereParticleEmitter(5, 0);

        particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1, 1);
        particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1, 1);
        particleSystem.colorDead = new BABYLON.Color4(0.2, 0.5, 1, 1);

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;

        { // 速率梯度控制
            particleSystem.addVelocityGradient(0, 3, 5); // 粒子出现时: 速率在3～5之间
            particleSystem.addVelocityGradient(1, -5, -10); // 粒子消失时: 速率在-10~-5之间
        }

        particleSystem.minEmitPower = 1;
        particleSystem.maxEmitPower = 1;
        particleSystem.updateSpeed = 0.005;

        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.5;

        particleSystem.minLifeTime = 0.3;
        particleSystem.maxLifeTime = 1.5;

        particleSystem.gravity = BABYLON.Vector3.Zero();

        particleSystem.emitRate = 1000;

        particleSystem.emitter = fountain;

        particleSystem.start();
    }

    private particleHelper(): void {
        // 快速创建粒子系统
        
        const fountain = BABYLON.MeshBuilder.CreateBox('fountain', {}, this._scene);

        const particles = BABYLON.ParticleHelper.CreateDefault(fountain, 10);
        particles.createConeEmitter(0.2, 0.5);

        particles.emitRate = 50;

        particles.minSize = 0.5;
        particles.maxSize = 0.8;

        particles.minLifeTime = 4;
        particles.maxLifeTime = 5;

        particles.minEmitPower = 10;
        particles.maxEmitPower = 20;

        particles.gravity = new BABYLON.Vector3(0, -9.81, 0);

        particles.start();

    }

    private dragFactor(): void {
        const fountain = BABYLON.MeshBuilder.CreateBox('fountain', {}, this._scene);

        const particles = BABYLON.ParticleHelper.CreateDefault(fountain, 10);
        particles.createConeEmitter(0.2, 0.5);

        particles.emitRate = 50;

        particles.minSize = 0.5;
        particles.maxSize = 0.8;

        particles.minLifeTime = 4;
        particles.maxLifeTime = 5;

        particles.minEmitPower = 10;
        particles.maxEmitPower = 20;

        particles.gravity = new BABYLON.Vector3(0, -9.81, 0);

        { // 设置阻力系数
            particles.addDragGradient(0, 0.8); // 粒子出现时: 阻力系数大
            particles.addDragGradient(1, 0.2); // 粒子结束时: 阻力系数小
        }

        particles.start();

    }

    private ramp(): void {
        const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 20, height: 20 }, this._scene);
        ground.material = new BABYLON.StandardMaterial('mat', this._scene);
        ground.material.backFaceCulling = false;
        
        const fireBlastTexture = new BABYLON.Texture('assets/textures/explosion.png', this._scene);

        setInterval(() => {
            const position = new BABYLON.Vector3(-10 + Math.random() * 20, 0, -10 + Math.random() * 20);
            createFireBlast(position);
        }, 2000);

        function createFireBlast(position: BABYLON.Vector3) {
            const fireBlast = BABYLON.ParticleHelper.CreateDefault(position, 100);
            fireBlast.createHemisphericEmitter(.2, 0);
    
            fireBlast.particleTexture = fireBlastTexture;
            fireBlast.blendMode = BABYLON.ParticleSystem.BLENDMODE_MULTIPLYADD;
    
            fireBlast.emitRate = 1000;
    
            fireBlast.minSize = 1.5;
            fireBlast.maxSize = 3;
    
            fireBlast.minLifeTime = 0.25;
            fireBlast.maxLifeTime = 0.75;

            fireBlast.minInitialRotation = -Math.PI / 2;
            fireBlast.maxInitialRotation = Math.PI / 2;

            fireBlast.addLimitVelocityGradient(0, 40);
            fireBlast.addLimitVelocityGradient(0.120, 12.983);
            fireBlast.addLimitVelocityGradient(0.445, 1.780);
            fireBlast.addLimitVelocityGradient(0.691, 0.502);
            fireBlast.addLimitVelocityGradient(0.930, 0.05);
            fireBlast.addLimitVelocityGradient(1.0, 0);

            fireBlast.addColorGradient(0.0, new BABYLON.Color4(1, 1, 1, 0));
            fireBlast.addColorGradient(0.1, new BABYLON.Color4(1, 1, 1, 1));
            fireBlast.addColorGradient(0.9, new BABYLON.Color4(1, 1, 1, 1));
            fireBlast.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
            
            fireBlast.addRampGradient(0.0, new BABYLON.Color3(1, 1, 1));
            fireBlast.addRampGradient(0.09, new BABYLON.Color3(209/255, 204/255, 15/255));
            fireBlast.addRampGradient(0.18, new BABYLON.Color3(221/255, 120/255, 14/255));
            fireBlast.addRampGradient(0.28, new BABYLON.Color3(200/255, 43/255, 18/255));
            fireBlast.addRampGradient(0.47, new BABYLON.Color3(115/255, 22/255, 15/255));
            fireBlast.addRampGradient(0.88, new BABYLON.Color3(14/255, 14/255, 14/255));
            fireBlast.addRampGradient(1.0, new BABYLON.Color3(14/255, 14/255, 14/255));
            fireBlast.useRampGradients = true;

            fireBlast.addColorRemapGradient(0, 0, 0.1);
            fireBlast.addColorRemapGradient(0.2, 0.1, 0.8);
            fireBlast.addColorRemapGradient(0.3, 0.2, 0.85);
            fireBlast.addColorRemapGradient(0.35, 0.4, 0.85);
            fireBlast.addColorRemapGradient(0.4, 0.5, 0.9);
            fireBlast.addColorRemapGradient(0.5, 0.95, 1.0);
            fireBlast.addColorRemapGradient(1.0, 0.95, 1.0);
    
            fireBlast.targetStopDuration = 0.1;
            // fireBlast.disposeOnStop = true;
    
            fireBlast.minEmitPower = 0.1;
            fireBlast.maxEmitPower = 40;
            fireBlast.updateSpeed = 0.005;
    
            fireBlast.start();
        }
    }

    private noiseTexture(): void {
        // 噪声纹理
        this._camera.radius = 8;

        const noiseTexture = new BABYLON.NoiseProceduralTexture('perlin', 256, this._scene);
        noiseTexture.animationSpeedFactor = 5; // 出现混乱的力度(数值越小，力度越大)
        noiseTexture.persistence = 3; // 持续性
        noiseTexture.brightness = 2; // 偏移(0.5为正常)
        noiseTexture.octaves = 4; // 音程(混乱程度)

        // 噪声纹理演示面板
        {
            const plane = BABYLON.Mesh.CreatePlane('plane', 1, this._scene);
            const mat = new BABYLON.StandardMaterial("mat", this._scene);
            plane.material = mat;
            plane.position.x = 2;
            mat.disableLighting = true;
            mat.backFaceCulling = false;
            mat.emissiveTexture = noiseTexture;
        }

        const particles = BABYLON.ParticleHelper.CreateDefault(BABYLON.Vector3.Zero(), 100);
        particles.createPointEmitter(BABYLON.Vector3.Up(), BABYLON.Vector3.Up());

        particles.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
        
        particles.minLifeTime = 1;
        particles.maxLifeTime = 1;

        particles.updateSpeed = 0.005;

        // 应用噪声纹理
        {
            particles.noiseTexture = noiseTexture;
            particles.noiseStrength = new BABYLON.Vector3(10, 10, 10); // 力度方向
        }
        
        particles.start();
    }

    private gpuParticles(): void {
        this._camera.radius = 10;

        const particleSystem = new BABYLON.GPUParticleSystem('sunSurface', { capacity: 20000 }, this._scene);
        particleSystem.particleTexture = new BABYLON.Texture('assets/textures/sunSurface.png', this._scene);

        const coreSphere = BABYLON.MeshBuilder.CreateSphere('core', { diameter: 2.01, segments: 64 }, this._scene);
        coreSphere.material = new BABYLON.StandardMaterial('coreMat', this._scene);
        (<BABYLON.StandardMaterial>coreSphere.material).emissiveColor = new BABYLON.Color3(0.3773, 0.0930, 0.0266);

        const sunEmitter = new BABYLON.SphereParticleEmitter(1.05, 0.05);

        particleSystem.emitter = coreSphere;
        particleSystem.particleEmitterType = sunEmitter;
        
        particleSystem.emitRate = 100;

        particleSystem.minSize = 0.4;
        particleSystem.maxSize = 0.7;
        
        particleSystem.addColorGradient(0, new BABYLON.Color4(0.8509, 0.4784, 0.1019, 0.0));
        particleSystem.addColorGradient(0.4, new BABYLON.Color4(0.6259, 0.3056, 0.0619, 0.5));
        particleSystem.addColorGradient(0.5, new BABYLON.Color4(0.6039, 0.2887, 0.0579, 0.5));
        particleSystem.addColorGradient(1.0, new BABYLON.Color4(0.3207, 0.0713, 0.0075, 0.0));

        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;

        particleSystem.minLifeTime = 8;
        particleSystem.maxLifeTime = 8;

        particleSystem.minInitialRotation = -2 * Math.PI;
        particleSystem.maxInitialRotation = 2 * Math.PI;

        particleSystem.minAngularSpeed = -0.4;
        particleSystem.maxAngularSpeed = 0.4;

        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 0;
        particleSystem.updateSpeed = 0.005;

        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);

        particleSystem.isBillboardBased = false;

        particleSystem.preWarmCycles = 50;
        particleSystem.preWarmStepOffset = 10;
        
        particleSystem.start();
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