// note this route has to deleted or modified. 
// the problem with this route is it doesn't check if the otp is verified or not.

import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { authSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";

export async function PUT(req) {
    try {
        await connectDB();
        const payload = await req.json();
        const validationSchema = authSchema.pick({
            email:true,password: true
        })
        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false, 401, "Invalid or missing input fields", validatedData.error);
        }
        const {email, password} = validatedData.data;
        const getUser = await UserModel.findOne({email, deletedAt:null}).select("+password");
        if(!getUser){
            return response(false, 401, "Invalid or missing input field");
        }
        getUser.password = password;
        await getUser.save();
        return response(true, 200, "Password reset successful")
    } catch (error) {
        return catchError(error);
    }
}