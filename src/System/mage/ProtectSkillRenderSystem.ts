import { Inject, System } from "flat-ecs";
import { Color, ShapeRenderer } from "gdxts";
import { Health } from "../../component/Health";
import { Spartial } from "../../component/Spatial";
import { GameState } from "../../dto/GameState";

export class ProtectSkillRenderSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("shapeRenderer") shapeRenderer: ShapeRenderer;

  process(): void {
    const spartialProtectSkill = this.world.getComponent(
      this.gameState.protectSkill,
      Spartial
    );
    const healthPlayer = this.world.getComponent(
      this.gameState.playerID,
      Health
    );

    this.shapeRenderer.begin();
    if (healthPlayer.hp >= 0) {
      this.shapeRenderer.circle(
        true,
        spartialProtectSkill.pos.x,
        spartialProtectSkill.pos.y,
        spartialProtectSkill.radius,
        Color.RED
      );
    }
    this.shapeRenderer.end();
  }
}
