Reproduce

1. Start

```
yarn install
yarn start
```

2. Visit playground `localhost3000:/graphql`

3. Create a subscription to appCreated2

```
subscription { appCreated2 { message}}
```

4. Force a message through AppResolver2

```
mutation { createApp2(message: "test") {message} }
```

5. See the injected provider is logged as it should be

```
AppService {}
```

6. Create a subscription to appCreated

```
subscription { appCreated { message}}
```

7. Force a message through AppResolver

```
mutation { createApp(message: "test") {message} }
```

8. See the provider is undefined

```
undefined
```
