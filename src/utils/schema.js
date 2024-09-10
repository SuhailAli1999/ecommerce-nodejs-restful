import Joi from 'joi'

const modelId = Joi.string().hex().length(24)

export const schemas = {
	modelId,
}
