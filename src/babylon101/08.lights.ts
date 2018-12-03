import * as BABYLON from 'babylonjs';
import { arcRotateCameraFixer } from '../libs/tencentTouchFixers';

export default class Game {
    private _canvas: HTMLCanvasElement;
    private _engine: BABYLON.Engine;
    private _scene: BABYLON.Scene;
    private _camera: BABYLON.ArcRotateCamera;

    constructor(canvasElement: string) {
        this._canvas = document.querySelector(canvasElement) as HTMLCanvasElement;
        this._engine = new BABYLON.Engine(this._canvas, true, {}, true);
        this._scene = new BABYLON.Scene(this._engine);
        this._camera = new BABYLON.ArcRotateCamera('arcam', 0, Math.PI / 4, 20, BABYLON.Vector3.Zero(), this._scene);
        arcRotateCameraFixer(this._camera);
        this._camera.attachControl(this._canvas);
        // this.pointLight();
        // this.directionLight();
        // this.spotLight();
        // this.hemisphericLight();
        // this.lightControl();
        this.limitations();
        // this.includedAndExcluded();
        // this.lightmap();
        // this.projectionTexture();
    }

    private createBasicEnv(): void {
        const box = BABYLON.MeshBuilder.CreateBox('box', {}, this._scene);
        box.position.y = 1;
        BABYLON.MeshBuilder.CreateGround('ground', { width: 4, height: 4 }, this._scene);
    }

    private pointLight(): void {
        this.createBasicEnv();
        const redLightPosition = new BABYLON.Vector3(5, 5, 5);
        const greenLightPosition = new BABYLON.Vector3(-5, 5, -5);
        const redColor = new BABYLON.Color3(1, 0, 0);
        const greenColor = new BABYLON.Color3(0, 1, 0);

        const redMaterial = new BABYLON.StandardMaterial('red-material', this._scene);
        redMaterial.emissiveColor = redColor;
        const redLightMesh = BABYLON.MeshBuilder.CreateSphere('red-pointLight-mesh', { diameter: 0.2 }, this._scene);
        redLightMesh.position = redLightPosition;
        redLightMesh.material = redMaterial;
        const redLight = new BABYLON.PointLight(
            'redPointLight',
            redLightPosition, // 光源位置
            this._scene
        );
        redLight.diffuse = redColor;

        const greenMaterial = new BABYLON.StandardMaterial('green-material', this._scene);
        greenMaterial.emissiveColor = greenColor;
        const greenLightMesh = BABYLON.MeshBuilder.CreateSphere('green-pointLight-mesh', { diameter: 0.2 }, this._scene);
        greenLightMesh.position = greenLightPosition;
        greenLightMesh.material = greenMaterial;
        const greenLight = new BABYLON.PointLight('green-point-light', greenLightPosition, this._scene);
        greenLight.diffuse = greenColor;
    }

    private directionLight(): void {
        this.createBasicEnv();
        const direction = new BABYLON.Vector3(-1, -1, -1);
        new BABYLON.DirectionalLight(
            'dlight',
            direction, // 照射方向
            this._scene
        );
    }

    private spotLight(): void {
        this.createBasicEnv();
        const material = new BABYLON.StandardMaterial('mat', this._scene);
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        const lightMesh = BABYLON.MeshBuilder.CreateSphere('lmesh', { diameter: 0.2 }, this._scene);
        lightMesh.material = material;
        lightMesh.position = new BABYLON.Vector3(1, 1, 1);
        const light = new BABYLON.SpotLight(
            'sLight',
            new BABYLON.Vector3(1, 1, 1), // 光源位置
            new BABYLON.Vector3(-1, -1, -1),
            Math.PI / 2,
            10,
            this._scene
        );
        light.diffuse = new BABYLON.Color3(1, 1, 1);
        light.specular = new BABYLON.Color3(1, 0, 0);
    }

    public hemisphericLight(): void {
        this.createBasicEnv();
        const position = new BABYLON.Vector3(5, 5, 5);
        const material = new BABYLON.StandardMaterial('mat', this._scene);
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        const lightMesh = BABYLON.MeshBuilder.CreateSphere('lmesh', { diameter: 0.2 }, this._scene);
        lightMesh.material = material;
        lightMesh.position = position;
        const light = new BABYLON.HemisphericLight('hLight', position, this._scene);
        light.diffuse = new BABYLON.Color3(1, 0, 0);
        light.specular = new BABYLON.Color3(0, 1, 0);
        light.groundColor = new BABYLON.Color3(0, 0, 1);
    }

    private lightControl(): void {
        this.createBasicEnv();
        const material = new BABYLON.StandardMaterial('mat', this._scene);
        material.emissiveColor = new BABYLON.Color3(1, 0, 0);
        const lightMesh = BABYLON.MeshBuilder.CreateSphere('lmesh', { diameter: 0.2 }, this._scene);
        lightMesh.material = material;
        lightMesh.position = new BABYLON.Vector3(1, 1, 1);
        const light = new BABYLON.SpotLight(
            'sLight',
            new BABYLON.Vector3(1, 1, 1), // 光源位置
            new BABYLON.Vector3(-1, -1, -1),
            Math.PI / 2,
            10,
            this._scene
        );
        light.diffuse = new BABYLON.Color3(1, 1, 1); // 基础反射色
        light.specular = new BABYLON.Color3(1, 0, 0); // 反射高光色
        light.intensity = 0.6; // 光强(亮度)
        light.range = 4; // 光照距离(只适用于PointLight以及SpotLight)
        light.setEnabled(true); // 是否启用
    }

    private limitations(): void {
        // 正常情况下，一个StandardMaterial材质只能同时反馈4个光线
        // 可以通过material.maxSimultaneousLights来解除该限制
        // 在某些性能比较差的设备上，可能会因为性能缘故而无法解除限制
        const light0 = new BABYLON.PointLight("Omni0", new BABYLON.Vector3(0, 10, 0), this._scene);
        const light1 = new BABYLON.PointLight("Omni1", new BABYLON.Vector3(0, -10, 0), this._scene);
        const light2 = new BABYLON.PointLight("Omni2", new BABYLON.Vector3(10, 0, 0), this._scene);
        const light3 = new BABYLON.DirectionalLight("Dir0", new BABYLON.Vector3(1, -1, 0), this._scene);
        const light4 = new BABYLON.PointLight("Omni3", new BABYLON.Vector3(10, 0, 0), this._scene);
        const light5 = new BABYLON.PointLight("Omni4", new BABYLON.Vector3(10, 0, 0), this._scene);

        // Lights colors
        light0.diffuse = new BABYLON.Color3(1, 0, 0);
        light0.specular = new BABYLON.Color3(1, 0, 0);

        light1.diffuse = new BABYLON.Color3(0, 1, 0);
        light1.specular = new BABYLON.Color3(0, 1, 0);

        light2.diffuse = new BABYLON.Color3(0, 0, 1);
        light2.specular = new BABYLON.Color3(0, 0, 1);

        light3.diffuse = new BABYLON.Color3(1, 1, 1);
        light3.specular = new BABYLON.Color3(1, 1, 1);
        
        light4.diffuse = new BABYLON.Color3(1, 1, 0);
        light4.specular = new BABYLON.Color3(1, 1, 0);
        
        light5.diffuse = new BABYLON.Color3(0, 1, 1);
        light5.specular = new BABYLON.Color3(0, 1, 1);

        const material = new BABYLON.StandardMaterial("kosh", this._scene);
        material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        material.maxSimultaneousLights = 16;
        const sphere = BABYLON.Mesh.CreateSphere("Sphere", 32, 6, this._scene);
        sphere.material = material;

        // Creating light sphere
        const lightSphere0 = BABYLON.Mesh.CreateSphere("Sphere0", 16, 0.5, this._scene);
        const lightSphere1 = BABYLON.Mesh.CreateSphere("Sphere1", 16, 0.5, this._scene);
        const lightSphere2 = BABYLON.Mesh.CreateSphere("Sphere2", 16, 0.5, this._scene);
        const lightSphere3 = BABYLON.Mesh.CreateSphere("Sphere3", 16, 0.5, this._scene);
        const lightSphere4 = BABYLON.Mesh.CreateSphere("Sphere4", 16, 0.5, this._scene);

        // Sphere Materials
        const material0 = new BABYLON.StandardMaterial("red", this._scene);
        material0.emissiveColor = new BABYLON.Color3(1, 0, 0);

        const material1 = new BABYLON.StandardMaterial("green", this._scene);
        material1.emissiveColor = new BABYLON.Color3(0, 1, 0);

        const material2 = new BABYLON.StandardMaterial("blue", this._scene);
        material2.emissiveColor = new BABYLON.Color3(0, 0, 1);

        const material3 = new BABYLON.StandardMaterial("yellow", this._scene);
        material3.emissiveColor = new BABYLON.Color3(1, 1, 0);

        const material4 = new BABYLON.StandardMaterial("cyan", this._scene);
        material4.emissiveColor = new BABYLON.Color3(0, 1, 1);

        lightSphere0.material = material0;
        lightSphere1.material = material1;
        lightSphere2.material = material2;
        lightSphere3.material = material3;
        lightSphere4.material = material4;

        // Animations
        let alpha = 0;
        this._scene.beforeRender = (): void => {
            light0.position = new BABYLON.Vector3(10 * Math.sin(alpha), 0, 10 * Math.cos(alpha));
            light1.position = new BABYLON.Vector3(10 * Math.sin(alpha), 0, -10 * Math.cos(alpha));
            light2.position = new BABYLON.Vector3(10 * Math.cos(alpha), 0, 10 * Math.sin(alpha));
            light4.position = new BABYLON.Vector3(10 * Math.cos(alpha), 10 * Math.sin(alpha), 0);
            light5.position = new BABYLON.Vector3(10 * Math.sin(alpha), -10 * Math.cos(alpha), 0);

            lightSphere0.position = light0.position;
            lightSphere1.position = light1.position;
            lightSphere2.position = light2.position;
            lightSphere3.position = light4.position;
            lightSphere4.position = light5.position;

            alpha += 0.01;
        };
    }

    private includedAndExcluded(): void {
        //Light direction is up and left
        const light0 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), this._scene);
        light0.diffuse = new BABYLON.Color3(1, 0, 0);
        light0.specular = new BABYLON.Color3(0, 1, 0);
        light0.groundColor = new BABYLON.Color3(0, 1, 0);
        
        const light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), this._scene);
        light1.diffuse = new BABYLON.Color3(1, 1, 1);
        light1.specular = new BABYLON.Color3(1, 1, 1);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);
        
        const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {diameter: 0.5}, this._scene);	
        
        const spheres = [];
        for(var i = 0; i < 25; i++) {
            spheres[i] = sphere.clone("sphere" +i);
            spheres[i].position.x = -2 + i%5;
            spheres[i].position.z = 2 - Math.floor(i/5);
        }	
        
        light0.excludedMeshes.push(spheres[7], spheres[18]); // 不照射
        light1.includedOnlyMeshes.push(spheres[7], spheres[18]); // 只照射
    }

    private lightmap(): void {
        const info = document.createElement('div');
        Object.assign(info.style, {
            position: 'fixed',
            left: '50%',
            top: '10px',
            transform: 'translateX(-50%)',
            zIndex: '999',
            color: '#fff',
            fontSize: '20px'
        });
        document.body.appendChild(info);

        const lightSphereMat = new BABYLON.StandardMaterial('light-sphere-mat', this._scene);
        lightSphereMat.emissiveColor = new BABYLON.Color3(1, 1, 1);
        const lightSphere = BABYLON.MeshBuilder.CreateSphere('light-sphere', { diameter: 0.2 }, this._scene);
        lightSphere.material = lightSphereMat;
        lightSphere.position = new BABYLON.Vector3(3, 3, 2);
        const light = new BABYLON.PointLight('plight', new BABYLON.Vector3(3, 3, 2), this._scene);
        light.intensity = 0.7;

        const lightmap = new BABYLON.Texture('assets/textures/candleopacity.png', this._scene);
        const groundMaterial = new BABYLON.StandardMaterial('gound-mat', this._scene);
        groundMaterial.lightmapTexture = lightmap; // 光照贴图
        const ground = BABYLON.MeshBuilder.CreateGround('ground', {
            width: 20,
            height: 20
        }, this._scene);
        ground.material = groundMaterial;
        ground.receiveShadows = true; // 接收阴影

        const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {}, this._scene);
        sphere.position = new BABYLON.Vector3(0, 2, 0);
        const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.addShadowCaster(sphere); // 将sphere设置为产生阴影

        // 周期改变光源位置
        let curTime = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            const positionX = Math.sin(curTime / 1000) * 5;
            light.position.x = positionX;
            lightSphere.position.x = positionX;
            curTime += this._engine.getDeltaTime();
        });

        // 更改lightmap的类型(鼠标左键抬起)
        let mode = 0;
        let modeInfos: string[] = [
            'LIGHTMAP_DEFAULT', // 基本光 + 高光 + 阴影
            'LIGHTMAP_SPECULAR', // 高光 + 阴影
            'LIGHTMAP_SHADOWSONLY' // 阴影
        ];
        info.innerHTML = `LightMapMode: ${modeInfos[mode]}`;
        document.addEventListener('pointerup', () => {
            mode === 2 ? mode = 0 : mode ++;
            light.lightmapMode = mode;
            info.innerHTML = `LightMapMode: ${modeInfos[mode]}`;
        });

    }

    private projectionTexture(): void {
        // 光线纹理映射，只适用于SpotLight

        this._camera.alpha = 0;
        this._camera.beta = 0.8;
        this._camera.radius = 150;
        this._camera.upperBetaLimit = Math.PI / 2; // 绕x轴旋转的最大值
        this._camera.lowerRadiusLimit = 30; // 镜头最近距离
        this._camera.upperRadiusLimit = 200; // 镜头最远距离
        
        const hLight = new BABYLON.HemisphericLight('hlight', new BABYLON.Vector3(0, 1, 0), this._scene);
        hLight.intensity = 0.1;

        const sLight = new BABYLON.SpotLight('slight', new BABYLON.Vector3(30, 40, 30), new BABYLON.Vector3(-1, -2, -1), 1.1, 16, this._scene);
        sLight.projectionTexture = new BABYLON.Texture('assets/textures/co.png', this._scene); // 创建贴图映射
        sLight.intensity = 1.5;
        const sLightSphere = BABYLON.MeshBuilder.CreateSphere('slight-sphere', { diameter: 2 }, this._scene);
        sLightSphere.position = new BABYLON.Vector3(30, 40, 30);
        const sLightSphereMat = new BABYLON.StandardMaterial('sphere-mat', this._scene);
        sLightSphereMat.emissiveTexture = new BABYLON.Texture('assets/textures/co.png', this._scene);
        sLightSphere.material = sLightSphereMat;

        const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap('ground', 'assets/textures/heightMap.png',
            {
                width: 100,
                height: 100,
                subdivisions: 50, // 高度贴图渲染质量
                minHeight: 0, // 最小高度
                maxHeight: 10 // 最大高度
            },
            this._scene
        );
        const groundMat = new BABYLON.StandardMaterial('ground-mat', this._scene);
        groundMat.specularColor = new BABYLON.Color3(0, 0, 0);
        const groundDiffuseTexture = new BABYLON.Texture('assets/textures/ground.jpg', this._scene);
        // uv缩放必须在texture实例级别
        groundDiffuseTexture.uScale = 6;
        groundDiffuseTexture.vScale = 6;
        groundMat.diffuseTexture = groundDiffuseTexture;
        ground.material = groundMat;

        let alpha = 0;
        this._scene.onBeforeRenderObservable.add(() => {
            const position = new BABYLON.Vector3(
                Math.cos(alpha) * 60,
                40,
                Math.sin(alpha) * 60
            );
            sLight.position = position;
            sLightSphere.position = position;
            sLightSphere.rotation.y = alpha;
            sLight.setDirectionToTarget(BABYLON.Vector3.Zero());
            alpha += 0.01;
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