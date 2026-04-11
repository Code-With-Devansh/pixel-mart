import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import UserModel from "@/models/User.model";


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
    const customers = await UserModel.find(filter).sort({createdAt:-1}).lean();
    if(!customers) {
        return response(false, 404, "No customers found.");
    }
    return response(true, 200, "Customers fetched successfully.", customers);
    
  } catch (error) {
    return catchError(error);
  }
}
