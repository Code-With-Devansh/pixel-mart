import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import CouponModel from "@/models/Coupon.model";


export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised");
    }
    await connectDB();

    const filter = {
      deletedAt: null,
    };
    const coupons = await CouponModel.find(filter).sort({createdAt:-1}).lean();
    if(!coupons) {
        return response(false, 404, "No products found.");
    }
    return response(true, 200, "Products fetched successfully.", coupons);
    
  } catch (error) {
    return catchError(error);
  }
}
