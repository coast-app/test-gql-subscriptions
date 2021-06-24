import { Injectable } from '@nestjs/common';
import { App } from './App';

@Injectable()
export class AppService {
  get(): App {
    const app = new App();
    app.message = 'hello world!';
    return app;
  }
}
