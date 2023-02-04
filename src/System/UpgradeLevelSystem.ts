import { Archetype, Inject, System } from "flat-ecs";
import { Damage } from "../component/Damage";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";

export class UpgradeLevelSystem extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  protectBallArchetype = new Archetype([Spartial, Damage]);
  offsetProtectBall = 100;

  process(): void {
    if (this.levelState.exp >= this.levelState.maxExp) {
      this.levelState.exp = 1;
      this.levelState.maxExp *= 1.5;
      this.levelState.currentLevel++;
      this.configGame.normalAttack *= 2;

      this.configGame.enemysRespawnTime /= 2;

      if (this.levelState.role === 1) {
        this.configGame.speedProtectBall++;
        this.configGame.cooldownSkill3 *= 2;
        for (let i = this.configGame.amountProtectBall - 1; i >= 0; i--) {
          this.world.deleteEntity(this.gameState.protectBall[i]);
          this.gameState.protectBall.splice(i, 1);
        }
        this.configGame.amountProtectBall = Math.max(
          this.configGame.amountProtectBall - 2,
          0
        );
        for (let i = 0; i < this.configGame.amountProtectBall; i++) {
          const protectBall = this.world.createEntityByArchetype(
            this.protectBallArchetype
          );
          this.gameState.protectBall.push(protectBall);
          const damageProtectBall = this.world.getComponent(
            protectBall,
            Damage
          );
          damageProtectBall.setDmg(50);
          const spartialProtectBall = this.world.getComponent(
            protectBall,
            Spartial
          );
          spartialProtectBall.pos.set(
            this.offsetProtectBall,
            this.offsetProtectBall
          );
          spartialProtectBall.setRadius(15);
          spartialProtectBall.setRotation(
            (360 / this.configGame.amountProtectBall) * i
          );
        }
      }
    }
  }
}
