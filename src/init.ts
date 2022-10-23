import dotenv from 'dotenv'
import commandLineArgs from 'command-line-args'
import { DataSource, DataSourceOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import appRootPath from 'app-root-path'

import x from './domain'
export async function initDataSource() {
	// Setup command line options
	const options = commandLineArgs([
		{
			name: 'env',
			alias: 'e',
			defaultValue: 'development',
			type: String
		}
	])

	const path = appRootPath.resolve(`env/${options.env}.env`)
	// Set the env file
	const result = dotenv.config({
		path
	})

	if (result.error) {
		throw result.error
	}

	const defaultOptions: DataSourceOptions = {
		name: 'default',
		type: 'postgres',
		host: process.env.TYPEORM_DEFAULT_HOST || 'localhost',
		port: Number(process.env.TYPEORM_DEFAULT_PORT) || 5200,
		username: process.env.TYPEORM_DEFAULT_USERNAME,
		password: process.env.TYPEORM_DEFAULT_PASSWORD,
		database: process.env.TYPEORM_DEFAULT_DATABASE,
		entities: ['src/entity/**/*.ts'],
		migrations: ['src/migrations/*.ts'],
		subscribers: ['src/subscribers/*.ts'],
		namingStrategy: new SnakeNamingStrategy(),
		synchronize: process.env.TYPEORM_DEFAULT_SYNCHRONIZE == 'true',
		logging: process.env.TYPEORM_DEFAULT_LOGGING == 'true',
		extra: {
			// based on  https://node-postgres.com/api/pool
			// max connection pool size
			max: Number(process.env.TYPEORM_DEFAULT_CONNECTION_MAX), // by default this is set to 10.
			// connection timeout
			connectionTimeoutMillis: Number(
				process.env.TYPEORM_DEFAULT_CONNECTION_TIMEOUT
			),
			// number of milliseconds a client must sit idle in the pool and not be checked out
			// before it is disconnected from the backend and discarded
			// default is 10000 (10 seconds) - set to 0 to disable auto-disconnection of idle clients
			idleTimeoutMillis: Number(process.env.TYPEORM_DEFAULT_IDLE_TIMEOUT)
			// allowExitOnIdle: false
		}
	}

	const appDataSource = new DataSource(defaultOptions)
	await appDataSource.initialize()
	console.log('@pre-start default database connect successful~~~~~')

	x.dds = appDataSource
}
