import {
  AssetManager,
  createGameLoop,
  createStage,
  createViewport,
  Game,
} from "gdxts";
import { Constants } from "./Constant";
import { createGameScreen } from "./gameScreen/GameScreen";

export const init = async () => {
  const stage = createStage();
  const canvas = stage.getCanvas();
  const viewport = createViewport(
    canvas,
    Constants.SCREEN_WIDTH,
    Constants.SCREEN_HEIGHT
  );
  const gl = viewport.getContext();

  const assetManager = new AssetManager(gl);
  // await assetManager.loadTexture("./pauseIcon.png", "pauseIcon");
  // await assetManager.loadTexture("./playIcon.png", "playIcon");
  await assetManager.loadTexture("./knight.png", "knight");
  await assetManager.loadTexture("./knight1.png", "knight1");
  await assetManager.loadTexture("./knight2.png", "knight2");
  await assetManager.loadTexture("./knight3.png", "knight3");
  await assetManager.loadTexture("./knight4.png", "knight4");

  await assetManager.loadTexture("./mage.png", "mage");
  await assetManager.loadTexture("./mage1.png", "mage1");
  await assetManager.loadTexture("./mage2.png", "mage2");
  await assetManager.loadTexture("./mage3.png", "mage3");
  await assetManager.loadTexture("./mage4.png", "mage4");
  Game.shared.setScreen(await createGameScreen(assetManager, viewport));

  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
