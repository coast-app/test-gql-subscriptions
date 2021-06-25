import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppResolver } from './app.resolver';
import { AppResolver2 } from './app.resolver2';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot({
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
    }),
  ],
  providers: [AppService, AppResolver, AppResolver2],
})
export class AppModule {}
