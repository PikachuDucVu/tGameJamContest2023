import { verify } from "crypto";
import { Archetype, World } from "flat-ecs";
import {
  AssetManager,
  InputHandler,
  OrthoCamera,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Viewport,
  ViewportInputHandler,
} from "gdxts";
import { wrap } from "module";
import { Damage } from "../component/Damage";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";
import { Skill3ProcessSystem } from "../System/Skill3ProcessSystem";
import { Skill3RenderSystem } from "../System/Skill3RenderSystem";
import { Skill3SpawningSystem } from "../System/Skill3SpawningSystem";
import { CameraProcessingSystem } from "../System/CameraProcessingSystem";
import { EnemyMovementSystem } from "../System/EnemyMovementSystem";
import { EnemyRenderSystem } from "../System/EnemyRenderSystem";
import { EnemySpawningSystem } from "../System/EnemySpawningSystem";
import { GridMapRenderSystem } from "../System/GridMapRenderSystem";
import { JoystickRenderSystem } from "../System/JoystickRenderSystem";
import { JoystickSystem } from "../System/JoystickSystem";
import { PlayerMovementSystem } from "../System/PlayerMovementSystem";
import { PlayerRenderSystem } from "../System/PlayerRenderSystem";
import { ProtectBallProcessSystem } from "../System/ProtectBallProcessSystem";
import { ProtectBallRenderSystem } from "../System/ProtectBallRenderSystem";
import { ProtectBallSpawningSystem } from "../System/ProtectBallSpawningSystem";
import { UpgradeLevelSystem } from "../System/UpgradeLevelSystem";
import { NormalAttackSpawningSystem } from "../System/NormalAttackSpawningSystem";
import { NormalAttackRenderSystem } from "../System/NormalAttackRenderSystem";
import { NormalAttackProcessingSystem } from "../System/NormalAttackProcessSystem";

export const createGameScreen = async (
  assetManager: AssetManager,
  viewport: Viewport
): Promise<Screen> => {
  const gl = viewport.getContext();
  const cameraUI = viewport.getCamera();

  const viewportInfo = viewport.getViewportInfo();
  const cameraGame = new OrthoCamera(
    Constants.SCREEN_WIDTH,
    Constants.SCREEN_HEIGHT,
    viewportInfo.worldWidth,
    viewportInfo.worldHeight
  );
  viewport.addCamera(cameraGame);
  const world = new World();

  const batch = new PolygonBatch(gl);
  const shapeRenderer = new ShapeRenderer(gl);
  const inputHandler = new ViewportInputHandler(viewport);

  const joyStick: JoyStick = {
    origin: new Vector2(),
    direction: new Vector2(),
    thumbPos: new Vector2(),

    touched: false,
    move: false,
    dragging: false,
  };

  //perSecond
  const configGame: ConfigGame = {
    normalAttack: 0.25,
    cooldownSkill3: 0.45,
    enemysRespawnTime: 1.25,
    amountProtectBall: 5,
    speedProtectBall: 3,

    start: true,
    pause: false,
    stop: false,
  };

  const playerArchetype = new Archetype([Spartial, Moveable, Health]);
  const player = world.createEntityByArchetype(playerArchetype);
  const gameState: GameState = {
    playerID: player,
    enemyIDs: [],
    bulletIDs: [],
    normalAttackBulletIDs: [],
    protectBall: [],
  };
  const levelState: LevelState = {
    role: 1,
    exp: 1,
    maxExp: 10,
    currentLevel: 1,
  };

  const spartialPlayer = world.getComponent(gameState.playerID, Spartial);
  spartialPlayer.setPos(0, 0);
  spartialPlayer.setRadius(25);
  const moveAblePlayer = world.getComponent(gameState.playerID, Moveable);
  moveAblePlayer.speed = 5;
  const healthPlayer = world.getComponent(gameState.playerID, Health);
  healthPlayer.setHp(75);
  healthPlayer.setMaxHP(100);

  world.register("cameraGame", cameraGame);
  world.register("batch", batch);
  world.register("shapeRenderer", shapeRenderer);
  world.register("cameraUI", cameraUI);
  world.register("cameraGame", cameraGame);

  world.register("gameState", gameState);
  world.register("configGame", configGame);
  world.register("levelState", levelState);

  world.register("inputHandler", inputHandler);
  world.register("joyStick", joyStick);

  world.addSystem(new JoystickSystem(), true);
  world.addSystem(new PlayerMovementSystem(), true);
  world.addSystem(new EnemySpawningSystem(), true);
  world.addSystem(new EnemyMovementSystem(), true);
  world.addSystem(new Skill3SpawningSystem(), true);
  world.addSystem(new Skill3ProcessSystem(), true);
  world.addSystem(new ProtectBallSpawningSystem(), true);
  world.addSystem(new ProtectBallProcessSystem(), true);
  world.addSystem(new UpgradeLevelSystem(), true);
  world.addSystem(new NormalAttackSpawningSystem(), true);
  world.addSystem(new NormalAttackProcessingSystem(), true);

  world.addSystem(new CameraProcessingSystem(), false);
  world.addSystem(new GridMapRenderSystem(), false);
  world.addSystem(new JoystickRenderSystem(), false);
  world.addSystem(new PlayerRenderSystem(), false);
  world.addSystem(new EnemyRenderSystem(), false);
  world.addSystem(new NormalAttackRenderSystem(), false);
  world.addSystem(new Skill3RenderSystem(), false);
  world.addSystem(new ProtectBallRenderSystem(), false);

  gl.clearColor(0, 0, 0, 1);

  return {
    update(delta: number) {
      gl.clear(gl.COLOR_BUFFER_BIT);
      batch.setProjection(cameraGame.combined);
      shapeRenderer.setProjection(cameraGame.combined);

      world.setDelta(delta);
      if (!configGame.pause && !configGame.stop) {
        world.processActiveSystem();
      }
      world.processPassiveSystem();
    },
    dispose(): void {},
  };
};
