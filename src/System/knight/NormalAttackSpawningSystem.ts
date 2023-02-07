import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { JoyStick } from "../../dto/JoyStick";
import { LevelState } from "../../dto/LevelState";

export class NormalAttackSpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("levelState") levelState: LevelState;
  cooldownNormalAttack = -3;

  process(): void {
    this.cooldownNormalAttack += this.world.delta;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );
    //normalAttack
    if (
      this.cooldownNormalAttack >= this.configGame.normalAttack &&
      this.joyStick.direction.x != 0 &&
      this.levelState.currentLevel <= 3
    ) {
      for (
        let i = -2 + (this.levelState.currentLevel - 1);
        i <= 2 - (this.levelState.currentLevel - 1);
        i++
      ) {
        const normalAttackAchetype = new Archetype([
          Spartial,
          Moveable,
          Damage,
        ]);
        const normalAttack =
          this.world.createEntityByArchetype(normalAttackAchetype);
        this.gameState.normalAttackBulletIDs.push(normalAttack);
        const spartialBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Spartial
        );
        const moveAbleBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Moveable
        );
        const damageBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Damage
        );
        spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
        spartialBullet.setRadius(25);

        moveAbleBullet.setDirection(
          this.joyStick.direction.x,
          this.joyStick.direction.y
        );
        moveAbleBullet.direction.rotate(5 * i);

        moveAbleBullet.setSpeed(20);
        damageBullet.setDmg(50 * this.levelState.currentLevel);
      }

      this.cooldownNormalAttack = 0;
    }
    if (this.levelState.currentLevel === 4) {
      if (
        this.cooldownNormalAttack >= this.configGame.normalAttack &&
        this.joyStick.direction != new Vector2(0, 0)
      ) {
        const normalAttackAchetype = new Archetype([
          Spartial,
          Moveable,
          Damage,
        ]);
        const normalAttack =
          this.world.createEntityByArchetype(normalAttackAchetype);
        this.gameState.normalAttackBulletIDs.push(normalAttack);
        const spartialBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Spartial
        );
        const moveAbleBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Moveable
        );
        const damageBullet = this.world.getComponent(
          this.gameState.normalAttackBulletIDs[
            this.gameState.normalAttackBulletIDs.length - 1
          ],
          Damage
        );
        spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
        spartialBullet.setRadius(10);

        moveAbleBullet.setDirection(
          this.joyStick.direction.x,
          this.joyStick.direction.y
        );
        moveAbleBullet.direction.rotate(0);

        moveAbleBullet.setSpeed(20);
        damageBullet.setDmg(25 * this.levelState.currentLevel);

        this.cooldownNormalAttack = 0;
      }
    }
  }
}
