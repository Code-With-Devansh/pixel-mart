import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";   
import CouponModel from "@/models/Coupon.model";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const payload = await req.json();
    const schema = zSchema.pick({
      _id: true,
      discountPercentage: true,
      code: true,
      minShoppingAmount: true,
      validity: true,
    });
    const validateddata = schema.safeParse(payload);
    if(!validateddata.success){
        return response(false, 400, "missing or invalid input field.", validateddata.error);
    }
    const {_id, discountPercentage, code, minShoppingAmount, validity} = validateddata.data;
    const getCoupon = await CouponModel.findOne({_id});
    if(!getCoupon){
        return response(false, 400, "Invalid coupon id.");
    }
    getCoupon.discountPercentage = discountPercentage;
    getCoupon.code = code;
    getCoupon.minShoppingAmount = minShoppingAmount;
    getCoupon.validity = validity;
    await getCoupon.save();
    return response(true, 200, "Coupon updated successfully."); 
  } catch (error) {
    return catchError(error);
  }
}
