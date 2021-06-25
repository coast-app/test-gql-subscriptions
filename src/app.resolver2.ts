import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { App } from './App';
import { AppService } from './app.service';

const pubsub = new PubSub();
@Resolver(() => App)
export class AppResolver2 {
  constructor(private readonly appService: AppService) {}

  @Query(() => App)
  getApp2(): App {
    return this.appService.get();
  }

  @Mutation(() => App)
  public async createApp2(@Args('message') message: string): Promise<App> {
    const app = new App();
    app.message = message;
    await pubsub.publish('appCreated', { appCreated: app });
    return app;
  }

  @Subscription(() => App, {
    filter(this: AppResolver2, payload: any) {
      console.log(this.appService);
      return true;
    },
  })
  public appCreated2() {
    return pubsub.asyncIterator<App>('appCreated');
  }
}
