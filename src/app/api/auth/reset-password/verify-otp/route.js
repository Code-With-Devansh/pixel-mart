import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { authSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";


export async function POST(req){
    try{
        await connectDB();
        const payload = await req.json();
        const validationSchema = authSchema.pick({
            otp:true, email:true
        })
        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false, 401, 'invalid or missing otp.', validatedData.error);

        }
        const {email, otp} = validatedData.data;
        const getOtpData = await OTPModel.findOne({email, otp});
        if(!getOtpData){
            return response(false, 401, 'invalid or expired otp.');
        }
        const getUser = await UserModel.findOne({deletedAt:null, email});
        if(!getUser){
            return response(false, 401, 'invalid or expired otp.');
        }
        //remove otp after validation
        await getOtpData.deleteOne();
        return response(true, 200, 'OTP Verified');
    }catch(e){
        return catchError(e);
    }
}