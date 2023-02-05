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
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";

export class MenuRenderSystem extends System {
  @Inject("cameraUI") cameraUI: OrthoCamera;
  @Inject("cameraGame") cameraGame: OrthoCamera;

  @Inject("configGame") configGame: ConfigGame;
  @Inject("inputHandler") inputHandler: InputHandler;
  @Inject("assetManager") assetManager: AssetManager;
  @Inject("batch") batch: PolygonBatch;
  @Inject("font1") font1: BitmapFont;
  @Inject("font2") font2: BitmapFont;

  knight: Texture;
  mage: Texture;
  offset = 150;

  initialized(): void {
    this.knight = this.assetManager.getTexture("knight") as Texture;
    this.mage = this.assetManager.getTexture("mage") as Texture;
  }
  process(): void {
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
    this.batch.end();
  }
}
