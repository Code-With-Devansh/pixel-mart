import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductVariantModel from "@/models/ProductVariant.model";

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
    const variants = await ProductVariantModel.find(filter).select('-media').sort({createdAt:-1}).lean();
    if(!variants) {
        return response(false, 404, "No product variants found.");
    }
    return response(true, 200, "Product variants fetched successfully.", variants);
    
  } catch (error) {
    return catchError(error);
  }
}
