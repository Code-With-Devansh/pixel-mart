import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";

import { isValidObjectId } from "mongoose";
import CouponModel from "@/models/Coupon.model";

export async function GET(req, { params }) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised");
    }
    await connectDB();
    const getParams = await params;
    const id = getParams.id;
    const filter = {
      deletedAt: null,
    };
    if (!isValidObjectId(id)) {
      return response(false, 400, "Invalid Object Id");
    }
    filter._id = id;
    const getcoupon = await CouponModel.findOne(filter).lean();
    if (!getcoupon) {
      return response(false, 400, "Invalid Object Id");
    }
    return response(true, 200, "Product Found", getcoupon);
  } catch (error) {
    return catchError(error);
  }
}
