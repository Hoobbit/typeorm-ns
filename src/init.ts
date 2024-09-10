import dotenv from 'dotenv'
import commandLineArgs from 'command-line-args'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import appRootPath from 'app-root-path'
import x from './ns'

let suffix = 'js'
/**
 * initEnv: production, development
 */
function initEnv() {
	// Setup command line options
	const options = commandLineArgs([
		{
			name: 'env',
			alias: 'e',
			defaultValue: 'development',
			type: String
		}
	])

	console.info('options.env:', options.env)
	const path = appRootPath.resolve(`env/${options.env}.env`)
	// Set the env file
	const result = dotenv.config({ path })

	if (result.error) {
		throw result.error
	}

	suffix = options.env.indexOf('prod') >= 0 ? 'js' : 'ts'
}
initEnv()

/**
 * initDefaultDataSource: init default datasource
 */
export async function initDefaultDataSource() {
	let defaultOptions: DataSourceOptions
	if (process.env.TYPEORM_DEFAULT_CONNECTION === 'oracle') {
		defaultOptions = {
			name: 'default',
			type: process.env.TYPEORM_DEFAULT_CONNECTION,
			host: process.env.TYPEORM_DEFAULT_HOST || 'localhost',
			port: Number(process.env.TYPEORM_DEFAULT_PORT) || 1521,
			username: process.env.TYPEORM_DEFAULT_USERNAME,
			password: process.env.TYPEORM_DEFAULT_PASSWORD,
			database: process.env.TYPEORM_DEFAULT_DATABASE,
			serviceName: process.env.TYPEORM_DEFAULT_DATABASE,
			maxQueryExecutionTime: 60000,
			entities: [appRootPath.resolve(`src/entity/**/*.${suffix}`)],
			migrations: [appRootPath.resolve(`src/migrations/*.${suffix}`)],
			subscribers: [appRootPath.resolve(`src/subscribers/*.${suffix}`)],
			namingStrategy: new SnakeNamingStrategy(),
			synchronize: process.env.TYPEORM_DEFAULT_SYNCHRONIZE == 'true',
			logging: process.env.TYPEORM_DEFAULT_LOGGING == 'true',
			// timezone: process.env.TZ || 'Asia/Shanghai',
			extra: {
				poolIncrement: 1,
				poolMax: Number.isNaN(
					Number(process.env.TYPEORM_DEFAULT_CONNECTION_MAX)
				)
					? 10
					: Number(process.env.TYPEORM_DEFAULT_CONNECTION_MAX),
				poolMin: 2,
				poolTimeout: 60, // seconds
				queueRequests: true,
				queueTimeout: 3000
				// allowExitOnIdle: false
			}
		}
	} else {
		defaultOptions = {
			name: 'default',
			type: 'postgres',
			host: process.env.TYPEORM_DEFAULT_HOST || 'localhost',
			port: Number(process.env.TYPEORM_DEFAULT_PORT) || 5432,
			username: process.env.TYPEORM_DEFAULT_USERNAME,
			password: process.env.TYPEORM_DEFAULT_PASSWORD,
			database: process.env.TYPEORM_DEFAULT_DATABASE,
			maxQueryExecutionTime: 60000,
			entities: [appRootPath.resolve(`src/entity/**/*.${suffix}`)],
			migrations: [appRootPath.resolve(`src/migrations/*.${suffix}`)],
			subscribers: [appRootPath.resolve(`src/subscribers/*.${suffix}`)],
			namingStrategy: new SnakeNamingStrategy(),
			synchronize: process.env.TYPEORM_DEFAULT_SYNCHRONIZE == 'true',
			logging: process.env.TYPEORM_DEFAULT_LOGGING == 'true',
			// timezone: process.env.TZ || 'Asia/Shanghai',
			extra: {
				// based on  https://node-postgres.com/api/pool
				// max connection pool size
				// by default this is set to 10.
				max: Number(process.env.TYPEORM_DEFAULT_CONNECTION_MAX),
				// connection timeout
				connectionTimeoutMillis: Number(
					process.env.TYPEORM_DEFAULT_CONNECTION_TIMEOUT
				),
				// number of milliseconds a client must sit idle in the pool and not be checked out
				// before it is disconnected from the backend and discarded
				// default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
				idleTimeoutMillis: Number(
					process.env.TYPEORM_DEFAULT_IDLE_TIMEOUT
				)
				// allowExitOnIdle: false
			}
		}
	}

	const appDataSource = new DataSource(defaultOptions)
	try {
		await appDataSource.initialize()
	} catch (e) {
		console.error(e)
	}
	x.dds = appDataSource
}
