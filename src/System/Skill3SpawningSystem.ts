import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { config } from "process";
import { Damage } from "../component/Damage";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";
import { JoyStick } from "../dto/JoyStick";
import { LevelState } from "../dto/LevelState";

export class Skill3SpawningSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  timeSkill3 = 0;
  tempNumber = 0;
  tempVec2 = new Vector2();

  process(): void {
    this.timeSkill3 += this.world.delta;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    //Skill3
    if (
      this.timeSkill3 >= this.configGame.cooldownSkill3 &&
      this.gameState.enemyIDs.length &&
      this.levelState.currentLevel < 3
    ) {
      const bulletArchetype = new Archetype([Spartial, Moveable, Damage]);
      const bullet = this.world.createEntityByArchetype(bulletArchetype);
      this.gameState.bulletIDs.push(bullet);
      const spartialBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Spartial
      );
      const moveAbleBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Moveable
      );
      const damageBullet = this.world.getComponent(
        this.gameState.bulletIDs[this.gameState.bulletIDs.length - 1],
        Damage
      );
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[0],
        Spartial
      );
      damageBullet.setDmg(25);
      this.tempNumber = spartialEnemy.pos.distance(spartialPlayer.pos);
      for (let i = 0; i < this.gameState.enemyIDs.length; i++) {
        const spartialEnemy = this.world.getComponent(
          this.gameState.enemyIDs[i],
          Spartial
        );
        if (this.tempNumber >= spartialEnemy.pos.distance(spartialPlayer.pos)) {
          this.tempNumber = spartialEnemy.pos.distance(spartialPlayer.pos);
          this.tempVec2
            .setVector(spartialEnemy.pos)
            .subVector(spartialPlayer.pos)
            .nor();
          moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
          moveAbleBullet.speed = 15;
        }
      }

      spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialBullet.setRadius(10);
      this.timeSkill3 = 0;
    }

    if (this.gameState.enemyIDs.length) {
    }
  }
}
