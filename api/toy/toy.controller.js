import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'

export async function getToys(req, res) {
    try {
        const { name, price, inStock, labels, type, desc } = req.query
        const filterBy = { name, price: +price, inStock , labels: (labels) ? labels : [] }
        const sortBy = { type, desc: +desc }

        logger.debug('Getting Toys', filterBy, sortBy)
        const toys = await toyService.query(filterBy, sortBy)
        res.json(toys)
    } catch (err) {
        logger.error('Failed to get toys', err)
        res.status(500).send({ err: 'Failed to get toys' })
    }
}

export async function getToyById(req, res) {
    try {
        const toyId = req.params.id
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        logger.error('Failed to get toy', err)
        res.status(500).send({ err: 'Failed to get toy' })
    }
}

export async function addToy(req, res) {
    const { loggedinUser } = req
    console.log('addToy')
    console.log('loggedinUser:', loggedinUser)
    if (!loggedinUser.isAdmin) return

    try {
        const toy = req.body
        // toy.owner = loggedinUser
        const addedToy = await toyService.add(toy)
        socketService.broadcast({ type: 'toy-added', data: addedToy, userId: loggedinUser._id })
        
        res.json(addedToy)
    } catch (err) {
        logger.error('Failed to add toy', err)
        res.status(500).send({ err: 'Failed to add toy' })
    }
}

export async function updateToy(req, res) {
    const { loggedinUser } = req

    console.log('updateToy')
    try {
        const toy = req.body
        const updatedToy = await toyService.update(toy)
        socketService.broadcast({ type: 'toy-updated', data: updatedToy, userId: loggedinUser._id })
        res.json(updatedToy)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToy(req, res) {
    const { loggedinUser } = req
    console.log('removeToy')
    try {
        const toyId = req.params.id
        const removedId = await toyService.remove(toyId)
        socketService.broadcast({ type: 'toy-removed', data: toyId, userId: loggedinUser._id })

        res.send()
    } catch (err) {
        logger.error('Failed to remove toy', err)
        res.status(500).send({ err: 'Failed to remove toy' })
    }
}

export async function addToyMsg(req, res) {
    const { loggedinUser } = req
    const {_id , fullname} = loggedinUser
    try {
        const toyId = req.params.id
        const msg = {
            txt: req.body.txt,
            by: {_id,fullname},
        }
        const savedMsg = await toyService.addToyMsg(toyId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update toy', err)
        res.status(500).send({ err: 'Failed to update toy' })
    }
}

export async function removeToyMsg(req, res) {
    const { loggedinUser } = req
    try {
        const toyId = req.params.id
        const { msgId } = req.params

        const removedId = await toyService.removeToyMsg(toyId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove toy msg', err)
        res.status(500).send({ err: 'Failed to remove toy msg' })
    }
}