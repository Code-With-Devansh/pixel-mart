import { emailVerificationLink } from "@/email/emailVerificationLink";
import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import {authSchema} from '@/lib/zodSchema';
import UserModel from "@/models/User.model";
import {z} from 'zod'
import { SignJWT } from "jose";

export async function POST(req){
    try {
        await connectDB()
        //validating input
        const validationSchema = authSchema.pick({
            email: true,
            password: true
        }).extend({
            name: z.string().min(3),
        })
        const payload = await req.json();
        const validatedData = validationSchema.safeParse(payload);

        if(!validatedData.success){
            return response(false, 401, 'invalid or missing input fields', validatedData.error);
        }

    
        const {name, email, password} = validatedData.data

        // check if user already exists
        const checkUser = await UserModel.exists({email});
        if(checkUser){
            return response(true, 409, 'user already registered');
        }

        //new registration
        const newRegistration = new UserModel({
            name, email, password
        })
        await newRegistration.save();
    
        const secret = new TextEncoder().encode(process.env.SECRET_KEY)
        const token = await new SignJWT({userId: newRegistration._id.toString()})
        .setIssuedAt()
        .setExpirationTime('1h')
        .setProtectedHeader({alg: 'HS256'})
        .sign(secret)

        // sending verification link to mail
        await sendMail('Email Verification request from Pixel Mart', email, emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`))
        return response(true, 200, "Registration Success, Please verify your email address. We have sent a verification link to your registered email address.")
    } catch (error) {
        return catchError(error);
    }
}