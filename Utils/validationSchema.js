const joi = require('joi');

const authSchema = joi.object({
    name:joi.string().required(),
    email:joi.string().email().lowercase().required(),
    password:joi.string().regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/).min(8).required()
})

module.exports = authSchema;