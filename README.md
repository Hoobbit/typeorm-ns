# typeorm namespace

## init default datasource

#### config file: appRootPath/env/[development].env

```
TYPEORM_DEFAULT_CONNECTION=postgresql
TYPEORM_DEFAULT_HOST=
TYPEORM_DEFAULT_PORT=
TYPEORM_DEFAULT_USERNAME=
TYPEORM_DEFAULT_PASSWORD=
TYPEORM_DEFAULT_DATABASE=
TYPEORM_DEFAULT_LOGGING=
TYPEORM_DEFAULT_SYNCHRONIZE=

TYPEORM_DEFAULT_CONNECTION_MAX=10
TYPEORM_DEFAULT_CONNECTION_TIMEOUT=30000
TYPEORM_DEFAULT_IDLE_TIMEOUT=10000
```

#### init

```
import { initDefaultDataSource } from 'typeorm-ns'

initDefaultDataSource()
  .then(async () => {
    //
  })
  .catch((err: any) => {
    logger.error(err)
  })
```

#### use repository

```
import { getRepository } from 'typeorm-ns'
import { EntityA } from '@entity/EntityA'

const aRepo = getRepository(EntityA)
return await aRepo.findAndCount(...)
```

#### use transaction

```
import { getTrxMgr } from 'typeorm-ns'
import { EntityA } from '@entity/EntityA'

return getTrxMgr().transaction(async (trxMgr: EntityManager) => {
  const aRepo = trxMgr.getRepository(EntityA)
  await aRepo.save(...)
  // do something ...
  const [items, total] = await aRepo.findAndCount(...)
  return { items, total }
})
```
