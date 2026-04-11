import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import mongoose from "mongoose";
import UserModel from "@/models/User.model";


export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "unauthorised");
    }
    await connectDB();
    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty id list.");
    }
    const customers = await UserModel.find({ _id: { $in: ids } }).lean();
    if (!customers.length) {
      return response(false, 404, "Data not found.");
    }
    if (!["SD", "RSD"].includes(deleteType)) {
      return response(false, 400, "Invalid Delete Operation.");
    }
    if (deleteType === "SD") {
      await UserModel.updateMany(
        { _id: { $in: ids } },
        { $set: { deletedAt: new Date().toISOString() } },
      );
    }else{
        await UserModel.updateMany(
          { _id: { $in: ids } },
          { $set: { deletedAt: null } },
        );
        
    }
    return response(true, 200, deleteType==='SD'?"Moved to Trash":"Data Restored successfully.")
  } catch (error) {
    return catchError(error);
  }
}

export async function DELETE(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "unauthorised");
    }
    await connectDB();
    const payload = await req.json();
    const ids = payload.ids || [];
    const deleteType = payload.deleteType;
    if (!Array.isArray(ids) || ids.length === 0) {
      return response(false, 400, "Invalid or Empty id list.");
    }
    const customers = await UserModel.find({ _id: { $in: ids } }).lean();
    if (!customers.length) {
      return response(false, 404, "Data not found.");
    }
    if (deleteType !=='PD') {
      return response(false, 400, "Invalid Delete Operation.");
    }
    await UserModel.deleteMany({ _id: { $in: ids } })


    return response(true, 200, 'Data deleted Permanently')
  } catch (error) {
    return catchError(error);
  }
}
