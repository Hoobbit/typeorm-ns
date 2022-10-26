import { DataSource, EntityTarget, ObjectLiteral } from 'typeorm'

var x = {
	dds: {} as DataSource // default data source
}

/**
 * @param entity
 * @param type empty: default datasource, 'lds': legacy datasource, 'mds': mongo datasource
 * @returns Repository<Type>
 */
export function getRepository<Type>(
	entity: EntityTarget<ObjectLiteral>,
	type?: String
) {
	if (!x.dds || !x.dds.isInitialized) {
		// TODO ? retry init
		throw new Error('DataSource has some problems!!!')
	}
	return x.dds.getRepository(entity)
}

/**
 * @function
 * @param type empty: default datasource, 'lds': legacy datasource, 'mds': mongo datasource
 * @returns DataSource
 */
export function getDataSource(type?: string) {
	return x.dds
}

/**
 *
 * @returns default datasource manager
 */
export function getTrxMgr() {
	if (!x.dds || !x.dds.isInitialized) {
		throw new Error('DataSource has some problems!!!')
	}
	return getDataSource().manager
}

export function closeAll() {
	if (x.dds.isInitialized) {
		return x.dds.destroy()
	}
}

export default x
