export interface GameState {
  playerID: number;
  enemyIDs: number[];
  bulletIDs: number[];
  normalAttackBulletIDs: number[];
  protectBall: number[];
}
