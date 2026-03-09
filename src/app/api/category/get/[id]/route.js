import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";

import { isValidObjectId } from "mongoose";
import CategoryModel from "@/models/Category.model";

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
    const getCategory = await CategoryModel.findOne(filter).lean();
    if (!getCategory) {
      return response(false, 400, "Invalid Object Id");
    }
    return response(true, 200, "Category Found", getCategory);
  } catch (error) {
    return catchError(error);
  }
}
