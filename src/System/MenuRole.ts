import { Inject, System } from "flat-ecs";
import { InputEvent, InputHandler } from "gdxts";
import { ConfigGame } from "../dto/ConfigGame";
import { LevelState } from "../dto/LevelState";
import { UpgradeLevelSystem } from "./UpgradeLevelSystem";
import { CameraProcessingSystem } from "./knight/CameraProcessingSystem";
import { JoystickRenderSystem } from "./knight/JoystickRenderSystem";
import { JoystickSystem } from "./knight/JoystickSystem";
import { NormalAttackProcessingSystem } from "./knight/NormalAttackProcessSystem";
import { NormalAttackRenderSystem } from "./knight/NormalAttackRenderSystem";
import { NormalAttackSpawningSystem } from "./knight/NormalAttackSpawningSystem";
import { PlayerRenderSystem } from "./PlayerRenderSystem";
import { ProtectBallProcessSystem } from "./knight/ProtectBallProcessSystem";
import { ProtectBallRenderSystem } from "./knight/ProtectBallRenderSystem";
import { ProtectBallSpawningSystem } from "./knight/ProtectBallSpawningSystem";
import { Skill3ProcessSystem } from "./knight/Skill3ProcessSystem";
import { Skill3RenderSystem } from "./knight/Skill3RenderSystem";
import { Skill3SpawningSystem } from "./knight/Skill3SpawningSystem";
import { GameState } from "../dto/GameState";
import { PlayerMovementSystem } from "./PlayerMovementSystem";
import { ProtectSkillRenderSystem } from "./mage/ProtectSkillRenderSystem";
import { ProtectProcessingSystem } from "./mage/ProtectProcessingSystem";
import { TornadoProcessSystem } from "./mage/TornadoProcessSystem";
import { TornadoSpawningSystem } from "./mage/TornadoSpawningSystem";
import { TornadoRenderSystem } from "./mage/TornadoRenderSystem";
import { EnemyMovementSystem } from "./EnemyMovementSystem";
import { EnemyRenderSystem } from "./EnemyRenderSystem";
import { EnemySpawningSystem } from "./EnemySpawningSystem";
import { LaserSpawningSystem } from "./mage/LaserSpawningSystem";
import { LaserProcessSystem } from "./mage/LaserProcessSystem";
import { LaserRenderSystem } from "./mage/LaserRenderSystem";
import { Constants } from "../Constant";

export class MenuRoleSystem extends System {
  @Inject("gameState") gameState: GameState;
  @Inject("configGame") configGame: ConfigGame;
  @Inject("inputHandler") inputHandler: InputHandler;
  @Inject("levelState") levelState: LevelState;

  initialized(): void {
    this.inputHandler.addEventListener(InputEvent.TouchStart, (x, y) => {
      if (this.configGame.start == false) {
        if (x >= 0 && x <= Constants.SCREEN_WIDTH / 2) {
          this.levelState.role = 1;
          this.world.addSystem(new JoystickSystem(), true);
          this.world.addSystem(new PlayerMovementSystem(), true);
          this.world.addSystem(new EnemySpawningSystem(), true);
          this.world.addSystem(new EnemyMovementSystem(), true);
          this.world.addSystem(new Skill3SpawningSystem(), true);
          this.world.addSystem(new Skill3ProcessSystem(), true);
          this.world.addSystem(new ProtectBallSpawningSystem(), true);
          this.world.addSystem(new ProtectBallProcessSystem(), true);
          this.world.addSystem(new UpgradeLevelSystem(), true);
          this.world.addSystem(new NormalAttackSpawningSystem(), true);
          this.world.addSystem(new NormalAttackProcessingSystem(), true);
          this.world.addSystem(new PlayerRenderSystem(), false);

          this.world.addSystem(new CameraProcessingSystem(), false);
          this.world.addSystem(new JoystickRenderSystem(), false);
          this.world.addSystem(new EnemyRenderSystem(), false);
          this.world.addSystem(new NormalAttackRenderSystem(), false);
          this.world.addSystem(new Skill3RenderSystem(), false);
          this.world.addSystem(new ProtectBallRenderSystem(), false);
          this.configGame.start = true;
        }
        if (x >= Constants.SCREEN_WIDTH / 2) {
          this.levelState.role = 2;
          this.configGame.amountProtectBall = 15;
          this.configGame.start = true;

          this.world.addSystem(new PlayerMovementSystem(), true);
          this.world.addSystem(new JoystickSystem(), true);
          this.world.addSystem(new UpgradeLevelSystem(), true);
          this.world.addSystem(new EnemySpawningSystem(), true);
          this.world.addSystem(new EnemyMovementSystem(), true);
          this.world.addSystem(new ProtectProcessingSystem(), true);
          this.world.addSystem(new TornadoSpawningSystem(), true);
          this.world.addSystem(new TornadoProcessSystem(), true);
          this.world.addSystem(new LaserSpawningSystem(), true);
          this.world.addSystem(new LaserProcessSystem(), true);

          this.world.addSystem(new CameraProcessingSystem(), false);
          this.world.addSystem(new ProtectSkillRenderSystem(), false);
          this.world.addSystem(new PlayerRenderSystem(), false);
          this.world.addSystem(new JoystickRenderSystem(), false);
          this.world.addSystem(new EnemyRenderSystem(), false);
          this.world.addSystem(new TornadoRenderSystem(), false);
          this.world.addSystem(new LaserRenderSystem(), false);
        }
      }
    });
  }
  process(): void {}
}
