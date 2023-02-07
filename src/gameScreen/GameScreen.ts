import { Archetype, World } from "flat-ecs";
import {
  AssetManager,
  BitmapFont,
  InputHandler,
  OrthoCamera,
  PolygonBatch,
  Screen,
  ShapeRenderer,
  Vector2,
  Viewport,
  ViewportInputHandler,
} from "gdxts";

import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";
import { MenuRoleSystem } from "../System/MenuRole";
import { GridMapRenderSystem } from "../System/knight/GridMapRenderSystem";
import { MenuRenderSystem } from "../System/MenuRenderSystem";
import { PowerEnemy } from "../dto/PowerEnemy";
import { PauseMovementSystem } from "../System/PauseMovementSystem";

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

  const font = await BitmapFont.load(gl, "./font.fnt");
  const font2 = await BitmapFont.load(gl, "./font2.fnt");

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
    enemysRespawnTime: 0.2,
    amountProtectBall: 10,
    speedProtectBall: 5,
    timeToMakeDamage: 0.75,
    sizeSkill1Mage: 200,
    laserCooldown: 1.25,

    start: false,
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
    protectSkill: 0,
    laserSkillID: [],
    tempBullet: [],
  };
  const levelState: LevelState = {
    role: 0,
    exp: 1,
    maxExp: 100,
    currentLevel: 1,
  };
  const powerEnemy: PowerEnemy = {
    hp: 100,
    damage: 25,
  };

  const spartialPlayer = world.getComponent(gameState.playerID, Spartial);
  spartialPlayer.setPos(0, 0);
  spartialPlayer.setRadius(25);
  const moveAblePlayer = world.getComponent(gameState.playerID, Moveable);
  moveAblePlayer.speed = 4;
  const healthPlayer = world.getComponent(gameState.playerID, Health);
  healthPlayer.setHp(100);
  healthPlayer.setMaxHP(100);

  world.register("cameraGame", cameraGame);
  world.register("batch", batch);
  world.register("shapeRenderer", shapeRenderer);
  world.register("assetManager", assetManager);
  world.register("cameraUI", cameraUI);
  world.register("cameraGame", cameraGame);

  world.register("gameState", gameState);
  world.register("configGame", configGame);
  world.register("levelState", levelState);
  world.register("powerEnemy", powerEnemy);

  world.register("inputHandler", inputHandler);
  world.register("joyStick", joyStick);
  world.register("font", font);
  world.register("font2", font2);

  world.addSystem(new GridMapRenderSystem(), false);
  world.addSystem(new MenuRenderSystem(), false);
  world.addSystem(new MenuRoleSystem(), true);

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
