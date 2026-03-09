import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import MediaModel from "@/models/Media.model";
import { isValidObjectId } from "mongoose";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised");
    }
    await connectDB();

    const payload = await req.json();
    
    const schema = zSchema.pick({
        _id:true,
        alt:true,
        title:true
    })
    
    const validate = schema.safeParse(payload);
    if(!validate.success){
        return response(false, 400, "invalid or missing input fields.", validate.error);
    }
    
    const {_id, alt, title} = payload;
    
    if (!isValidObjectId(_id)) {
      return response(false, 400, "Invalid Object Id");
    }
    const getmedia = await MediaModel.findById(_id);
    if(!getmedia){
        return response(false, 404, "Media not found.");
    }
    getmedia.alt = alt;
    getmedia.title = title;
    await getmedia.save();
    return response(true, 200, "Media Updated Successfully.")
  } catch (error) {
    return catchError(error);
  }
}
