import { Archetype, Inject, System } from "flat-ecs";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";

export class ProtectProcessingSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  initialized() {
    const protectDmgArchetype = new Archetype([Spartial, Damage]);
    const protectSkill =
      this.world.createEntityByArchetype(protectDmgArchetype);
    this.gameState.protectSkill = protectSkill;
    const damageProtectSkill = this.world.getComponent(
      this.gameState.protectSkill,
      Damage
    );
    damageProtectSkill.setDmg(25);
  }

  process(): void {
    this.configGame.timeToMakeDamage +=
      this.world.delta * this.configGame.sizeSkill1Mage;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    const spartialProtectSkill = this.world.getComponent(
      this.gameState.protectSkill,
      Spartial
    );
    const damageProtectSkill = this.world.getComponent(
      this.gameState.protectSkill,
      Damage
    );

    spartialProtectSkill.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
    spartialProtectSkill.setRadius(this.configGame.timeToMakeDamage);
    if (this.configGame.timeToMakeDamage > this.configGame.sizeSkill1Mage) {
      for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[i],
          Spartial
        );
        const healthEnemy = this.world.getComponent(
          this.gameState.enemyIDs[i],
          Health
        );
        if (
          spartialEnemy.pos.x <=
            spartialProtectSkill.pos.x + spartialProtectSkill.radius &&
          spartialEnemy.pos.x >=
            spartialProtectSkill.pos.x - spartialProtectSkill.radius &&
          spartialEnemy.pos.y <=
            spartialProtectSkill.pos.y + spartialProtectSkill.radius &&
          spartialEnemy.pos.y >=
            spartialProtectSkill.pos.y - spartialProtectSkill.radius
        ) {
          healthEnemy.hp = Math.max(
            healthEnemy.hp - damageProtectSkill.damage,
            0
          );
        }
      }
      this.configGame.timeToMakeDamage = 0;
    }
  }
}
