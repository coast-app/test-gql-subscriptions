import { UsePipes } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'apollo-server-express';
import { App } from './App';
import { AppService } from './app.service';
import { RequestScopedPipe } from './request-scoped-pipe';

const pubsub = new PubSub();
@Resolver(() => App)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(() => App)
  getApp(): App {
    return this.appService.get();
  }

  @Mutation(() => App)
  @UsePipes(RequestScopedPipe)
  public async createApp(@Args('message') message: string): Promise<App> {
    const app = new App();
    app.message = message;
    await pubsub.publish('appCreated', { appCreated: app });
    return app;
  }

  @Subscription(() => App, {
    filter(this: AppResolver, payload: any) {
      console.log(this.appService);
      return true;
    },
  })
  public appCreated() {
    return pubsub.asyncIterator<App>('appCreated');
  }
}
