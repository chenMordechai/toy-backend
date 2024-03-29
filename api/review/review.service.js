import mongodb from 'mongodb'
const { ObjectId } = mongodb

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const reviewService = {
    remove,
    query,
    add,
    getById
}

async function query(filterBy = {}, sortBy = {}) {
    try {
        const criteria = _buildCriteria(filterBy)
        const sort = {}
        // if (sortBy.type) {
        //     sort = {
        //         [sortBy.type]: sortBy.desc
        //     }
        // }
        const collection = await dbService.getCollection('review')
        // var reviews = await collection.find(criteria).sort(sort).toArray()
        // console.log('reviews:', reviews)
        var reviews = await collection.aggregate([
            {
                $match: criteria
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            }
        ]).toArray()
        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name, imgUrl: review.aboutToy.imgUrl }
            delete review.byUserId
            delete review.aboutToyId
            return review
        })
        return reviews

    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    if (filterBy.txt) {
        criteria.txt = { $regex: filterBy.txt, $options: 'i' }
    }
    if (filterBy.aboutToyId) {
        criteria.aboutToyId = new ObjectId(filterBy.aboutToyId)
    }
    if (filterBy.byUserId) {
        criteria.byUserId = new ObjectId(filterBy.byUserId)
    }
    return criteria
}
async function getById(reviewId) {
    console.log('getById', reviewId)
    try {
        const collection = await dbService.getCollection('review')
        const review = await collection.findOne({ _id: new ObjectId(reviewId) })
        // return review
        console.log('review:', review)
        var reviews = await collection.aggregate([
            {
                $match: { _id: new ObjectId(reviewId) }
            },
            {
                $lookup:
                {
                    localField: 'byUserId',
                    from: 'user',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'aboutToyId',
                    from: 'toy',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            }
        ]).toArray()
        console.log('reviews:', reviews)
        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name, imgUrl: review.aboutToy.imgUrl }
            delete review.byUserId
            delete review.aboutToyId
            return review
        })
        console.log('reviews[0]:', reviews[0])
        return reviews[0]
    } catch (err) {
        logger.error(`while finding toy ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        const reviewToAdd = {
            byUserId: new ObjectId(review.byUserId),
            aboutToyId: new ObjectId(review.aboutToyId),
            txt: review.txt
        }
        const collection = await dbService.getCollection('review')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}


async function remove(reviewId) {
    try {
        const collection = await dbService.getCollection('review')
        await collection.deleteOne({ _id: new ObjectId(reviewId) })
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


