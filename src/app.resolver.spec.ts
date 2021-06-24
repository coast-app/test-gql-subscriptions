import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      providers: [AppService, AppResolver],
    }).compile();
  });

  describe('getApp', () => {
    it('should return "hello world"', () => {
      const appResolver = app.get<AppResolver>(AppResolver);
      expect(appResolver.getApp().message).toBe('hello world');
    });
  });
});
