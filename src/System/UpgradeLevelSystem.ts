import { Archetype, Inject, System } from "flat-ecs";
import { Damage } from "../component/Damage";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { LevelState } from "../dto/LevelState";
import { PowerEnemy } from "../dto/PowerEnemy";

export class UpgradeLevelSystem extends System {
  @Inject("levelState") levelState: LevelState;
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("powerEnemy") powerEnemy: PowerEnemy;

  protectBallArchetype = new Archetype([Spartial, Damage]);
  offsetProtectBall = 100;

  process(): void {
    if (this.levelState.exp >= this.levelState.maxExp) {
      this.levelState.exp = 1;
      this.levelState.currentLevel++;
      this.configGame.enemysRespawnTime *= 2;
      this.powerEnemy.hp += 75;
      for (let i = this.configGame.amountProtectBall - 1; i >= 0; i--) {
        this.world.deleteEntity(this.gameState.protectBall[i]);
        this.gameState.protectBall.splice(i, 1);
      }
      this.configGame.amountProtectBall = Math.max(
        this.configGame.amountProtectBall - 5,
        0
      );

      if (this.levelState.currentLevel === 1) {
        this.levelState.maxExp = 100;
      }
      if (this.levelState.currentLevel === 2) {
        this.levelState.maxExp = 70;
      }
      if (this.levelState.currentLevel === 3) {
        this.levelState.maxExp = 50;
      }
      if (this.levelState.currentLevel === 4) {
        this.levelState.maxExp = 30;
      }

      if (this.levelState.role === 1) {
        this.configGame.normalAttack *= 2;
        this.configGame.speedProtectBall++;
        this.configGame.cooldownSkill3 *= 2;

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
      if (this.levelState.role === 2) {
        this.configGame.sizeSkill1Mage /= 1.5;
        this.configGame.laserCooldown += 0.5;

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
