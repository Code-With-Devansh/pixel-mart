import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";

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
    const products = await ProductModel.find(filter).select('-media -description').sort({createdAt:-1}).lean();
    if(!products) {
        return response(false, 404, "No products found.");
    }
    return response(true, 200, "Products fetched successfully.", products);
    
  } catch (error) {
    return catchError(error);
  }
}
