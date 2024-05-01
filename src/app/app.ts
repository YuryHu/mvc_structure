import { Controller } from './components/controller';

export class App {
  private readonly controller: Controller;

  constructor() {
    this.controller = new Controller();
  }

  start(): void {
    this.controller.start();
  }
}
