import { isAuthenticated } from "@/lib/authentication";
import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import ProductModel from "@/models/Product.model";
import UserModel from "@/models/User.model";

export async function GET(req){
    try {
        const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const [category, product, customer] = await Promise.all([
        CategoryModel.countDocuments({deletedAt: null}),
        ProductModel.countDocuments({deletedAt:null}),
        UserModel.countDocuments({deletedAt:null}),
    ])
    return response(true, 200, "Count fetched successfully.", {category, product, customer});
    } catch (error) {
        return catchError(error)
    }
}