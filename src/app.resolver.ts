import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { App } from './App';
import { AppService } from './app.service';

@Resolver(() => App)
export class AppResolver {
  private readonly pubsub: PubSub;
  constructor(private readonly appService: AppService) {
    this.pubsub = new PubSub();
  }

  @Query(() => App)
  getApp(): App {
    return this.appService.get();
  }

  @Mutation(() => App)
  public async createApp(@Args('message') message: string): Promise<App> {
    const app = new App();
    app.message = message;
    await this.pubsub.publish('appCreated', { appCreated: app });
    return app;
  }

  @Subscription((returns) => App, {
    filter(this: AppResolver, payload: any) {
      console.log(this.appService.get);
      return this.appService.get().message === payload.appCreated.message;
    },
  })
  public appCreated() {
    return this.pubsub.asyncIterator<App>('appCreated');
  }
}
