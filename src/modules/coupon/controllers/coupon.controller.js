import { ApiFeatures } from '../../../utils/apiFeatures.js'
import { catchAsyncError } from '../../../utils/error.handler.js'
import couponModel from '../models/coupon.model.js'

export const addCoupon = catchAsyncError(async (req, res) => {
	const coupon = await couponModel.create(req.body)
	res.status(201).json({ coupon })
})

export const getAllCoupons = catchAsyncError(async (req, res) => {
	const apiFeatures = new ApiFeatures(couponModel.find(), req.query).paginate(
		10
	)
	const coupons = await apiFeatures.query
	res.status(201).json({ coupons })
})

export const getCoupon = catchAsyncError(async (req, res) => {
	const { couponId } = req.params

	const coupon = await couponModel.findById(couponId)
	if (coupon) {
		return res.json({ coupon })
	}
	res.status(404).json({ error: 'Coupon not found' })
})

export const updateCoupon = catchAsyncError(async (req, res) => {
	const { couponId } = req.params

	const coupon = await couponModel.findByIdAndUpdate(couponId, req.body, {
		new: true,
	})

	if (coupon) {
		return res.json({ coupon })
	}
	res.status(404).json({ error: 'Coupon not found' })
})

export const deleteCoupon = catchAsyncError(async (req, res) => {
	const couponId = req.params.couponId
	console.log(couponId)
	const deletedCoupon = await couponModel.findByIdAndDelete(couponId)

	if (deletedCoupon) {
		return res.json({ message: 'Coupon deleted successfully' })
	}
	res.status(404).json({ error: 'Coupon not found' })
})
