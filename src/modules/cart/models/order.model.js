import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true,
		},
		products: [
			{
				product_id: {
					type: mongoose.Schema.Types.ObjectId,
					required: true,
				},
				quantity: {
					type: Number,
					required: true,
				},
			},
		],
	},
	{ timestamps: true }
)

cartSchema.pre(/find/i, function (next) {
	this.populate('products.product_id')
	next()
})

const orderModel = mongoose.model('order', orderSchema)

export default orderModel
