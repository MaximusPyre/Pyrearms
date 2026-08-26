# Host directory

Public cheat-sheet of PyreArms hostnames: **https://hub.pyrearms.dev**

The list lives in [`src/data/pyreHosts.ts`](../src/data/pyreHosts.ts). Add a row there when a new subdomain ships, then:

```bash
npm run deploy:hub
```

Same data is rendered on the education site at `/sites` after that frontend deploys.
