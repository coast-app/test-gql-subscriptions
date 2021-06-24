import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { execute, FetchResult, GraphQLRequest, Observable } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { gql } from 'apollo-server-express';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import * as request from 'supertest';
import * as WebSocket from 'ws';
import { AppModule } from './../src/app.module';

describe('AppResolver (e2e)', () => {
  let link: WebSocketLink;
  let app: INestApplication;
  let client: SubscriptionClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    await app.listen(3000);
    client = new SubscriptionClient(
      'ws://localhost:3000/graphql',
      { reconnect: true },
      WebSocket,
    );
    link = new WebSocketLink(client);
  });
  afterAll(async () => {
    client.close();
    return app.close();
  });

  it('gets app', async () => {
    const response = await request(app.getHttpServer()).post('/graphql').send({
      variables: {},
      query: '{ getApp { message } }',
    });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      data: {
        getApp: { message: 'hello world!' },
      },
    });
  });

  it('creates an app', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        variables: { message: 'newMessage' },
        query:
          'mutation ($message: String!) { createApp(message: $message) { message } }',
      });

    expect(response.status).toEqual(200);
    expect(response.body).toEqual({
      data: {
        createApp: { message: 'anything' },
      },
    });
  });
  describe('subscription', () => {
    let subscriptionPromise: Promise<any>;
    beforeAll(async () => {
      const subscription: GraphQLRequest = {
        query: gql`
          subscription appCreated {
            appCreated {
              message
            }
          }
        `,
      };
      subscriptionPromise = subscribe(subscription, link);

      let response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          variables: { message: 'hello world' },
          query:
            'mutation ($message: String!) { createApp(message: $message) { message } }',
        });
      response = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          variables: { message: 'hello world!' },
          query:
            'mutation ($message: String!) { createApp(message: $message) { message } }',
        });
    });

    it.only('receives subscribed event when app created', async () => {
      await expect(subscriptionPromise).resolves.toMatchObject({
        data: { appCreated: { message: 'hello world!' } },
      });
    });
  });
});

function subscribe(
  operation: GraphQLRequest,
  link: WebSocketLink,
  maxSeconds: number = 5,
): Promise<Observable<FetchResult>> {
  return new Promise((resolve: any, reject: any): void => {
    const timeout = setTimeout(
      () => reject('Timed out waiting for message'),
      maxSeconds * 1000,
    );
    execute(link, operation).subscribe({
      next: (value: any): void => {
        clearTimeout(timeout);
        resolve(value);
      },
      error: (error: any): void => {
        clearTimeout(timeout);
        reject(error);
      },
    });
  });
}
