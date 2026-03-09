import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

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
    const getMedia = await MediaModel.findOne(filter).lean();
    if (!getMedia) {
      return response(false, 400, "Invalid Object Id");
    }
    return response(true, 200, "Media Found", getMedia);
  } catch (error) {
    return catchError(error);
  }
}
