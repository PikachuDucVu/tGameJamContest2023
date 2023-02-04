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

  Game.shared.setScreen(await createGameScreen(assetManager, viewport));

  createGameLoop((delta: number) => {
    Game.shared.update(delta);
  });
};
init();
