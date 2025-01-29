const Router = require('express')
const router = new Router()
let data = []

router.get('/user', (req, res) => {
    res.json(data)
})

router.post('/user', (req, res) => {
    if (!req.body || req.body.id === undefined) {
        return res.status(400).json({error: 'Request must contain an id'})
    }
    data.push(req.body.id)
    res.json({message: 'User added', data})
})

router.delete('/user', (req, res) => {
    if (!req.body || req.body.id === undefined) {
        return res.status(400).json({error: 'Request body must contain an id'})
    }

    data = data.filter(num => num !== req.body.id)
    res.json({message: 'User deleted', data})
})

router.patch('/user', (req, res) => {
    const userId = parseInt(req.body.id)
    const index = data.indexOf(userId)
    if (!req.body.id) res.status(400).json('bad req')

    data[index] = req.body.newId
    res.status(200).json({ message: 'User updated', users: data });
})

module.exports = router
