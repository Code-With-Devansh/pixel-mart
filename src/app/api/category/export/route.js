import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";

import CategoryModel from "@/models/Category.model";

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
    const categories = await CategoryModel.find(filter).sort({createdAt:-1}).lean();
    if(!categories) {
        return response(false, 404, "No category found.");
    }
    return response(true, 200, "Categories fetched successfully.", categories);
    
  } catch (error) {
    return catchError(error);
  }
}
