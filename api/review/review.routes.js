import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { log } from '../../middlewares/logger.middleware.js'
import { getReviews, addReview,  removeReview,getReviewById} from './review.controller.js'

export const reviewRoutes = express.Router()

// middleware that is specific to this router

reviewRoutes.get('/', log, getReviews)
reviewRoutes.get('/:id', getReviewById)
// reviewRoutes.post('/', addReview)
reviewRoutes.post('/', requireAuth, addReview)
// reviewRoutes.put('/:id', requireAdmin, updateReview)
// reviewRoutes.delete('/:id',  removeReview)
reviewRoutes.delete('/:id', requireAdmin, removeReview)
