import { Inject, System } from "flat-ecs";
import {
  AssetManager,
  BitmapFont,
  InputEvent,
  InputHandler,
  OrthoCamera,
  PolygonBatch,
  Texture,
} from "gdxts";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";

export class MenuRenderSystem extends System {
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("cameraGame") cameraGame: OrthoCamera;
  @Inject("gameState") gameState: GameState;

  @Inject("configGame") configGame: ConfigGame;
  @Inject("inputHandler") inputHandler: InputHandler;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("font1") font1: BitmapFont;
  @Inject("font2") font2: BitmapFont;

  knight: Texture;
  mage: Texture;
  offset = 150;
  pauseIcon: Texture;
  playIcon: Texture;

  initialized(): void {
    this.pauseIcon = this.assetManager.getTexture("pauseIcon") as Texture;
    this.playIcon = this.assetManager.getTexture("playIcon") as Texture;
    this.knight = this.assetManager.getTexture("knight") as Texture;
    this.mage = this.assetManager.getTexture("mage") as Texture;
  }
  process(): void {
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    this.batch.setProjection(this.cameraUI.combined);
    this.batch.begin();
    if (this.configGame.start === false) {
      this.batch.draw(
        this.knight,
        Constants.SCREEN_WIDTH / 2 - this.offset - 200,
        Constants.SCREEN_HEIGHT / 2 - this.offset - 50,
        300,
        300
      );
      this.batch.draw(
        this.mage,
        Constants.SCREEN_WIDTH / 2 - this.offset + 250,
        Constants.SCREEN_HEIGHT / 2 - this.offset - 25,
        200,
        250
      );
    }
    // pause/playIcon
    if (this.configGame.start) {
      if (this.configGame.pause === false) {
        this.batch.draw(this.pauseIcon, 600, 1350, 100, 100);
      } else {
        this.batch.draw(this.playIcon, 600, 1350, 100, 100);
      }
    }

    this.batch.end();
  }
}
