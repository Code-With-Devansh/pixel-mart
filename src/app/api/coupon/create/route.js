import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CouponModel from "@/models/Coupon.model";

export async function POST(req) {
  const payload = await req.json();
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const schema = zSchema.pick({
      discountPercentage: true,
      code: true,
      minShoppingAmount: true,
      validity: true,
    });
    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(
        false,
        400,
        "invalid or missing fields.",
        validated.error,
      );
    }
    const couponData = validated.data;
    const newCoupon = new CouponModel({
      discountPercentage: couponData.discountPercentage,
      code: couponData.code,
      minShoppingAmount: couponData.minShoppingAmount,
      validity: couponData.validity,
    });
    await newCoupon.save();
    return response(true, 200, "Coupon Added Successfully.");
  } catch (error) {
    return catchError(error);
  }
}
