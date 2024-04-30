const { verify } = require('jsonwebtoken')

require('dotenv').config();

const validateToken = (req, res, next) => {
  const accessToken = req.header("accessToken")

  if (!accessToken) return res.json({ error: "Vous n'êtes pas authentifier" })

  try {
    const validToken = verify(accessToken, process.env.JWT_SIGN_SECRET)

    req.personne = validToken

    if (validToken) {
      return next()
    }

  } catch (error) {
    return res.json({ error: error })
  }

}

module.exports = { validateToken }