import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
    remove,
    query,
    getById,
    add,
    update,
    addToyMsg,
    removeToyMsg,
    addMsgToChat
}

async function query(filterBy = {}, sortBy = {}) {
    console.log('query', sortBy)
    try {
        const criteria = _buildCriteria(filterBy)
        let sort = {}
        if (sortBy.type) {
            sort = {
                [sortBy.type]: sortBy.desc
            }
            console.log('sort:', sort)
        }
        const collection = await dbService.getCollection('toy')
        console.log('collection:')
        // var toys = await collection.find(criteria, { sort }).toArray()
        var toyCursor = await collection.find(criteria).sort(sort)

        // paiging
        // if(filterBy.pageIndex !== undefined){
        //     toyCursor.skip(filterBy.pageIdx *PAGE_SIZE).limit(PAGE_SIZE)
        // }

        const toys = toyCursor.toArray()
        return toys
    } catch (err) {
        logger.error('cannot find toys', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.name) {
        criteria.name = { $regex: filterBy.name, $options: 'i' }
    }
    if (filterBy.price) {
        criteria.price = { $lt: filterBy.price }
    }
    if (filterBy.inStock !== 'all') {
        criteria.inStock = (filterBy.inStock === 'inStock') ? true : false
    }
    if (filterBy.labels && filterBy.labels.length !== 0) {
        // $all - if every labels found
        criteria.labels = { $all: [...filterBy.labels] }
        // $in - if some of the labels found
        // criteria.labels = { $in: [...filterBy.labels] }
    }
    return criteria

}

async function getById(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        const toy = await collection.findOne({ _id: new ObjectId(toyId) })
        return toy
    } catch (err) {
        logger.error(`while finding toy ${toyId}`, err)
        throw err
    }
}

async function add(toy) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.insertOne(toy)
        return toy
    } catch (err) {
        logger.error('cannot insert toy', err)
        throw err
    }
}

async function update(toy) {
    try {
        const { name, price, inStock, labels } = toy
        const toyToSave = { name, price, inStock, labels }

        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toy._id) }, { $set: toyToSave })
        return toy
    } catch (err) {
        logger.error(`cannot update toy ${toyId}`, err)
        throw err
    }
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.deleteOne({ _id: new ObjectId(toyId) })
    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}




async function addToyMsg(toyId, msg) {
    try {
        msg.id = utilService.makeId()
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { msgs: msg } })
        return msg
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function removeToyMsg(toyId, msgId) {
    try {
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id:new ObjectId(toyId) }, { $pull: { msgs: { id: msgId } } })
        return msgId
    } catch (err) {
        logger.error(`cannot add toy msg ${toyId}`, err)
        throw err
    }
}

async function addMsgToChat(msg, toyId) {
    try {
        console.log('toyId', toyId);
        const collection = await dbService.getCollection('toy')
        await collection.updateOne({ _id: new ObjectId(toyId) }, { $push: { chatHistory: msg } })
        console.log('addMsgToChat')
    } catch (err) {
        console.log(`ERROR: cannot add message to toy`)
        throw err;
    }
}

