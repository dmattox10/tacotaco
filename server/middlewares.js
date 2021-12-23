import { verify } from 'jsonwebtoken'
import { SHARED_SECRET, BYPASS_SECRET } from './env'

export function checkAuth(req, res, next) {
    const token = req.get('x-auth-token')
    if (!token) {
        return res.status(401).json({ error: 'Access denied, missing token' })
    } else {
        try {
            const payload = verify(token, SHARED_SECRET)
            req.user = payload.user
            next()
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired, please login again.' })
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Invalid Token, please login again.' })
            } else {
                console.error(error)
                return res.status(400).json({ error })
            }
        }
    }
}

export function bypassAuth(req, res, next) {
    const token = req.get('x-auth-token')
    if (!token) {
        return res.status(401).json({ error: 'Access denied, missing token' })
    } else {
        next()
    }
}