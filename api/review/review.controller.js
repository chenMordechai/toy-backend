import { reviewService } from './review.service.js'
import { logger } from '../../services/logger.service.js'

export async function getReviews(req, res) {
    try {
        const { txt, aboutToyId, byUserId } = req.query
        const filterBy = { txt , aboutToyId , byUserId }
        const sortBy = { }

        logger.debug('Getting Reviews', filterBy, sortBy)
        const reviews = await reviewService.query(filterBy, sortBy)
        res.json(reviews)
    } catch (err) {
        logger.error('Failed to get reviews', err)
        res.status(500).send({ err: 'Failed to get reviews' })
    }
}

export async function addReview(req, res) {
    const { loggedinUser } = req
    try {
        const review = req.body // txt,aboutToyId
        // review.byUserId = '656c29766b05f4baadc8ca9d'
        review.byUserId = loggedinUser._id
        const addedReview = await reviewService.add(review)

        // prepare the updated review for sending out
        // addedReview.aboutToy = await toyService.getById(review.aboutToyId)
     
         // Give the user credit for adding a review
        // var user = await userService.getById(review.byUserId)
        // user.score += 10
        // loggedinUser.score += 10
        // loggedinUser = await userService.update(loggedinUser)
        // review.byUser = loggedinUser
        // User info is saved also in the login-token, update it
        // const loginToken = authService.getLoginToken(loggedinUser)
        // res.cookie('loginToken', loginToken)
        // delete review.aboutToyId
        // delete review.byUserId


        res.json(addedReview)
    } catch (err) {
        logger.error('Failed to add review', err)
        res.status(500).send({ err: 'Failed to add review' })
    }
}

export async function removeReview(req, res) {
    console.log('removeReview')
    try {
        const reviewId = req.params.id
        await reviewService.remove(reviewId)
        res.send()
    } catch (err) {
        logger.error('Failed to remove review', err)
        res.status(500).send({ err: 'Failed to remove review' })
    }
}

export async function getReviewById(req, res) {
    try {
        const reviewId = req.params.id
        console.log('reviewId:', reviewId)
        const review = await reviewService.getById(reviewId)
        res.json(review)
    } catch (err) {
        logger.error('Failed to get review', err)
        res.status(500).send({ err: 'Failed to get review' })
    }
}



