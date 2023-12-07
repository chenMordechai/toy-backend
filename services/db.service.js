import mongoDB from 'mongodb'
const { MongoClient } = mongoDB

import { config } from '../config/index.js'

export const dbService = {
    getCollection
}

var dbConn = null

async function getCollection(collectionName) {
    // console.log('getCollection')
    try {
        const db = await _connect()
        const collection = await db.collection(collectionName)
        return collection
    } catch (err) {
        logger.error('Failed to get Mongo collection', err)
        throw err
    }
}

async function _connect() {
    if (dbConn) return dbConn
    try {
        // console.log('_connect')
        const client = await MongoClient.connect(config.dbURL)
        // const client = await MongoClient.connect(config.dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
        const db = client.db(config.dbName)
        dbConn = db
        return db
    } catch (err) {
        logger.error('Cannot Connect to DB', err)
        throw err
    }
}