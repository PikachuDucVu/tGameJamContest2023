import { Component } from "flat-ecs";
import { Vector2 } from "gdxts";

export class Moveable extends Component {
  direction: Vector2 = new Vector2();
  speed: number;
  setDirection(x: number, y: number) {
    this.direction.set(x, y);
  }
  setSpeed(speed: number) {
    this.speed = speed;
  }
}
