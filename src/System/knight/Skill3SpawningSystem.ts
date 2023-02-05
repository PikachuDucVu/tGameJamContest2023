import { Archetype, Inject, System } from "flat-ecs";
import { Vector2 } from "gdxts";
import { config } from "process";
import { Damage } from "../../component/Damage";
import { Moveable } from "../../component/Movable";
import { Spartial } from "../../component/Spatial";
import { ConfigGame } from "../../dto/ConfigGame";
import { GameState } from "../../dto/GameState";
import { JoyStick } from "../../dto/JoyStick";
import { LevelState } from "../../dto/LevelState";

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min)) + min;
}

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

      damageBullet.setDmg(25);

      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[
          getRandomInt(0, this.gameState.enemyIDs.length)
        ],
        Spartial
      );
      this.tempVec2
        .setVector(spartialEnemy.pos)
        .subVector(spartialPlayer.pos)
        .nor();

      moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAbleBullet.speed = 15;

      spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialBullet.setRadius(10);
      if (this.gameState.enemyIDs.length > 2) {
        for (let i = 0; i < 4 - this.levelState.currentLevel - 1; i++) {
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

          damageBullet.setDmg(25);

          const spartialEnemy = this.world.getComponent(
            this.gameState.enemyIDs[
              getRandomInt(0, this.gameState.enemyIDs.length)
            ],
            Spartial
          );
          this.tempVec2
            .setVector(spartialEnemy.pos)
            .subVector(spartialPlayer.pos)
            .nor();

          moveAbleBullet.setDirection(this.tempVec2.x, this.tempVec2.y);
          moveAbleBullet.speed = 15;

          spartialBullet.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
          spartialBullet.setRadius(10);
        }
      }

      this.timeSkill3 = 0;
    }
  }
}
