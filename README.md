![Aragon Court](./aragon-court.png)

## Build Setup

``` bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
$ yarn start
```

## Deployment

Pushes to `master` will automatically deploy with the mainnet configuration to `anj.aragon.org` via a [Github action](./github/workflows/gh-pages-deploy.yml).

To do this manually, you'll have to add some environment variables.

For rinkeby with Portis + Fortmatic:

```console
FORTMATIC_API_KEY=<fortmatic_api_key> PORTIS_DAPP_ID=<portis_app_id> yarn deploy:rinkeby
```

For mainnet with Portis + Fortmatic:

```console
FORTMATIC_API_KEY=<fortmatic_api_key> PORTIS_DAPP_ID=<portis_app_id> yarn deploy:mainnet
```
