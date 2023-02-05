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

export class LaserSpawningSystem extends System {
  @Inject("configGame") configGame: ConfigGame;
  @Inject("joyStick") joyStick: JoyStick;
  @Inject("gameState") gameState: GameState;
  @Inject("levelState") levelState: LevelState;

  timeLaser = 0;
  tempNumber = 0;
  tempVec2 = new Vector2();

  process(): void {
    this.timeLaser += this.world.delta;

    const spartialPlayer = this.world.getComponent(
      this.gameState.playerID,
      Spartial
    );

    //Laser
    if (
      this.timeLaser >= this.configGame.laserCooldown &&
      this.gameState.enemyIDs.length &&
      this.levelState.currentLevel < 3
    ) {
      const LaserArchetype = new Archetype([Spartial, Moveable, Damage]);
      const Laser = this.world.createEntityByArchetype(LaserArchetype);
      this.gameState.laserSkillID.push(Laser);
      const spartialLaser = this.world.getComponent(
        this.gameState.laserSkillID[this.gameState.laserSkillID.length - 1],
        Spartial
      );
      const moveAbleLaser = this.world.getComponent(
        this.gameState.laserSkillID[this.gameState.laserSkillID.length - 1],
        Moveable
      );
      const damageLaser = this.world.getComponent(
        this.gameState.laserSkillID[this.gameState.laserSkillID.length - 1],
        Damage
      );

      damageLaser.setDmg(15);

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

      moveAbleLaser.setDirection(this.tempVec2.x, this.tempVec2.y);
      moveAbleLaser.speed = 15;

      spartialLaser.setPos(spartialPlayer.pos.x, spartialPlayer.pos.y);
      spartialLaser.setRadius(50);

      this.timeLaser = 0;
    }
  }
}
