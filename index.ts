import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm'

export declare function getRepository<Type>(
	entity: EntityTarget<ObjectLiteral>,
	type?: String
): import('typeorm').Repository<ObjectLiteral>
export declare function getTrxMgr(): import('typeorm').EntityManager
export declare function getDataSource(type?: string): DataSource
export declare function initDataSource(): Promise<void>
export declare function closeAll(): Promise<void> | undefined
