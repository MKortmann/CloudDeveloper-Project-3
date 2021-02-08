// this file starts a connection between sequelize and your db.
// import the sequelize lib
import { Sequelize } from 'sequelize-typescript'
import { config } from './config/config'

const c = config;

// Instantiate new Sequelize instance!
// We can provide some of our parameters as below
// We can also select a dialetc and storage telling
// sequelize what type of store are we using
// we can also migrate between databases pretty easily.
// Sequelize can handle migrations under the hood and
// provide the same interfaces within our code.
// Sequilize is a relational ORM and won't really allow
// us to very easily migrate to a NoSQL type of databases.

export const sequelize = new Sequelize({
	username: c.username,
	password: c.password,
	database: c.database,
	host: c.host,

	dialect: 'postgres',
	storage: ':memory:',
})
