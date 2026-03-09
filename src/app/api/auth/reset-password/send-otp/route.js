import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/DBconnect";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendOtpEmail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(request){
    try {
        await connectDB();
        const payload = await request.json();
        const validationSchema = zSchema.pick({
            email:true
        })
        const validatedData = validationSchema.safeParse(payload);
        if(!validatedData.success){
            return response(false, 401, "Invalid/Wrong email Adress", validatedData.error);
        }
        const {email} = validatedData.data;
        const getUser = await UserModel.findOne({email, deletedAt: null}).lean();
        if(!getUser){
            return response(false, 401, "Invalid/Wrong email Adress", validatedData.error);
        }
        await OTPModel.deleteMany({email});
        const otp = generateOTP();
        const newOtpData = new OTPModel({
            email, otp
        })
        await newOtpData.save();
        const otpEmailStatus = await sendOtpEmail(otp, email, process.env.NEXT_PUBLIC_BASE_URL);
        if(!otpEmailStatus.success){
            return response(false, 500, 'failed to send email');
        }
        return response(true, 200, 'OTP sent Successfully.');


    } catch (error) {
        return catchError(error);
    }
}