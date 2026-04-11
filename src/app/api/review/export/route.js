import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ReviewModel from "@/models/Review.model";


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
    const reviews = await ReviewModel.find(filter).sort({createdAt:-1}).lean();
    if(!reviews) {
        return response(false, 404, "No reviews found.");
    }
    return response(true, 200, "Reviews fetched successfully.", reviews);
    
  } catch (error) {
    return catchError(error);
  }
}
