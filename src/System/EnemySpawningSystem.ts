import { System, Inject, Archetype } from "flat-ecs";
import { Health } from "../component/Health";
import { Moveable } from "../component/Movable";
import { Spartial } from "../component/Spatial";
import { Constants } from "../Constant";
import { ConfigGame } from "../dto/ConfigGame";
import { GameState } from "../dto/GameState";

export class EnemySpawningSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;

  MAX_ENEMIES = 30;

  time = -1;

  getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  process(): void {
    this.time += this.world.delta;
    if (
      this.time >= this.configGame.enemysRespawnTime &&
      this.gameState.enemyIDs.length < this.MAX_ENEMIES
    ) {
      const enemyArchetype = new Archetype([Spartial, Health]);
      const enemy = this.world.createEntityByArchetype(enemyArchetype);
      this.gameState.enemyIDs.push(enemy);
      const spartialEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Spartial
      );
      spartialEnemy.setPos(
        this.getRandomInt(0, Constants.SCREEN_WIDTH / 2),
        this.getRandomInt(0, Constants.SCREEN_HEIGHT / 2)
      );
      spartialEnemy.setRadius(25);
      const heathEnemy = this.world.getComponent(
        this.gameState.enemyIDs[this.gameState.enemyIDs.length - 1],
        Health
      );
      heathEnemy.setHp(75);
      heathEnemy.setMaxHP(100);

      this.time = 0;
    }
  }
}
