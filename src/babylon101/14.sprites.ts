import * as BABYLON from 'babylonjs';
import { arcRotateCameraFixer } from '../libs/tencentTouchFixers';

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
        // this._light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), this._scene); // sprites不受光线影响
        this._camera = new BABYLON.ArcRotateCamera('cam', - Math.PI / 2, Math.PI / 4, 10, BABYLON.Vector3.Zero(), this._scene);
        arcRotateCameraFixer(<BABYLON.ArcRotateCamera>this._camera);
        this._camera.attachControl(this._canvas);
        
        // this.basicSprites();
        this.spritesAnimation();
    }

    private basicSprites(): void {
        let n = 2000;
        const manager = new BABYLON.SpriteManager('treesManager', 'assets/textures/palm.png', n, 800, this._scene); // 创建精灵图管理器
        for (let i = 0; i < n; i ++) {
            const tree = new BABYLON.Sprite('tree', manager); // 创建实例，链接管理器
            tree.position.x = Math.random() * 100 - 50;
            tree.position.z = Math.random() * 100 - 50;
            if (Math.round(Math.random() * 5) === 0) {
                tree.angle = Math.PI / 2;
                tree.position.y = -0.3;
            }
        }
        // sprite.position.y = - 1; // 位置
        // sprite.size = 0.8; // 等比缩放
        // sprite.angle = Math.PI / 4; // z轴旋转角
        // sprite.invertU = 0; // 横向翻转(0: 不反转, 非0: 翻转)
        // sprite.invertV = 1; // 纵向翻转(0: 不反转, 非0: 翻转)
        // sprite.width = 0.3; // 横向缩放
        // sprite.height = 0.4; // 纵向缩放
    }

    private spritesAnimation(): void {
        const manager = new BABYLON.SpriteManager('players', 'assets/textures/player.png', 4, { width: 64, height: 64 }, this._scene);
        const player1 = new BABYLON.Sprite('player1', manager);
        player1.position.y = 2;
        player1.playAnimation(
            0, // 开始帧
            9, // 结束帧
            true, // 是否循环播放
            100, // 每帧播放延迟
            () => {} // 结束回调
        );
        const player2 = new BABYLON.Sprite('player2', manager);
        player2.position.x = 1;
        player2.position.y = 2;
        player2.playAnimation(0, 9, true, 50, () => {});

        const player3 = new BABYLON.Sprite('player3', manager);
        player3.position.y = 0;
        player3.playAnimation(0, 44, true, 100, () => {});
        const player4 = new BABYLON.Sprite('player4', manager);
        player4.position.x = 1;
        setInterval(() => {
            const index = Math.round(Math.random() * 44);
            player4.cellIndex = index;
        }, 1000);
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