import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer, Vector2 } from "gdxts";
import { Health } from "../component/Health";
import { Spartial } from "../component/Spatial";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";

export class PlayerRenderSystem extends System {
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  width = 50;
  offset = 25;
  tempDirection = new Vector2(0, 0);
  offsetAngle = 45;

  process(): void {
    const spartial = this.world.getComponent(this.gameState.playerID, Spartial);
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );
    this.shapeRenderer.begin();

    if (healthPlayer.hp > 0) {
      this.shapeRenderer.circle(
        true,
        spartial.pos.x,
        spartial.pos.y,
        spartial.radius,
        Color.GREEN
      );

      this.shapeRenderer.rect(
        true,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width * (healthPlayer.hp / healthPlayer.maxHP),
        15,
        Color.RED
      );
      this.shapeRenderer.rect(
        false,
        spartial.pos.x - this.offset,
        spartial.pos.y - this.offset - 15,
        this.width,
        15
      );
      //exp
      this.shapeRenderer.rect(
        true,
        spartial.pos.x - this.offset - 1,
        spartial.pos.y - this.offset - 25,
        this.width * (this.levelState.exp / this.levelState.maxExp),
        10,
        Color.WHITE
      );
      this.tempDirection.set(50, 50);
      this.tempDirection.rotate(spartial.rotation - this.offsetAngle);
      this.tempDirection.addVector(spartial.pos);
      this.shapeRenderer.circle(
        true,
        this.tempDirection.x,
        this.tempDirection.y,
        10,
        Color.MAGENTA
      );
    }
    this.shapeRenderer.end();
  }
}
