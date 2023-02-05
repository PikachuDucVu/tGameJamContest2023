import { Inject, System } from "flat-ecs";
import { Damage } from "../../component/Damage";
import { Health } from "../../component/Health";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { GameState } from "../../dto/GameState";

export class NormalAttackProcessingSystem extends System {
  @Inject("gameState") gameState: GameState;

  process(): void {
    //Out of ScreenGame
    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    for (let i = 0; i < this.gameState.normalAttackBulletIDs.length; i++) {
      const spartialBullet = this.world.getComponent(
        this.gameState.normalAttackBulletIDs[i],
        Spartial
      );
      if (spartialPlayer.pos.distance(spartialBullet.pos) > 350) {
        this.world.deleteEntity(this.gameState.normalAttackBulletIDs[i]);
        this.gameState.normalAttackBulletIDs.splice(i, 1);
      }
    }
    for (let i = this.gameState.normalAttackBulletIDs.length - 1; i >= 0; i--) {
      const spartialBullet = this.world.getComponent(
        this.gameState.normalAttackBulletIDs[i],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.normalAttackBulletIDs[i],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.normalAttackBulletIDs[i],
        Damage
      );

      spartialBullet.pos.add(
        moveAbleBullet.direction.x * moveAbleBullet.speed,
        moveAbleBullet.direction.y * moveAbleBullet.speed
      );
      //Collision
      for (let j = this.gameState.enemyIDs.length - 1; j >= 0; j--) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Spartial
        );
        const heathEnemy = this.world.getComponent(
          this.gameState.enemyIDs[j],
          Health
        );
        if (
          spartialEnemy.pos.x <= spartialBullet.pos.x + spartialBullet.radius &&
          spartialEnemy.pos.x >= spartialBullet.pos.x - spartialBullet.radius &&
          spartialEnemy.pos.y <= spartialBullet.pos.y + spartialBullet.radius &&
          spartialEnemy.pos.y >= spartialBullet.pos.y - spartialBullet.radius
        ) {
          // this.world.deleteEntity(this.gameState.normalAttackBulletIDs[i]);
          heathEnemy.hp = Math.max(heathEnemy.hp - damageBullet.damage, 0);
          // this.gameState.normalAttackBulletIDs.splice(i, 1);
        }
      }
    }
  }
}
