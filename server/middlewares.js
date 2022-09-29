const verify = require('jsonwebtoken')
const { SHARED_SECRET, BYPASS_SECRET } = require('./env.js')

exports.checkAuth = (req, res, next) => {
  const { accessToken } = req.headers
  if (!accessToken) {
    return res.status(401).json({ error: 'Access denied!' })
  } else {
    try {
      const payload = verify(accessToken, SHARED_SECRET)
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

exports.bypassAuth = (req, res, next) => {
  const accessToken = req.get('x-auth-token')
  if (accessToken === BYPASS_SECRET) {
    next()
  }
  return res.status(401).json({ error: 'Access denied, missing token' })
}
