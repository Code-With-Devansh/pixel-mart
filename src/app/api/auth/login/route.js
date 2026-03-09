import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectDB } from "@/lib/DBconnect";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendEmailVerification, sendOtpEmail } from "@/lib/sendMail";
import { zSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { z } from "zod";

export async function POST(req) {
  try {
    await connectDB();
    const payload = await req.json();

    //validate the Payload
    const validationSchema = zSchema
      .pick({
        email: true,
      })
      .extend({
        password: z.string(),
      });
    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "invaild or missing input field",
        validatedData.error,
      );
    }

    //Check Credentials
    const { email, password } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).select(
      "+password",
    );
    if (!getUser) {
      return response(
        false,
        400,
        "invaild login credentials.",
        validatedData.error,
      );
    }

    if (!getUser.isEmailVerified) {
      // send email verification link.
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userId: getUser._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      // sending verification link to mail
      await sendEmailVerification(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`, email, process.env.NEXT_PUBLIC_BASE_URL
      );
      return response(
        false,
        401,
        "Your Email is not verified. We have sent a verification link to your registered email.",
      );
    }
    const isPasswordVerified = await getUser.comparePassword(password);
    if (!isPasswordVerified) {
      return response(
        false,
        400,
        "invaild login credentials.",
        validatedData.error,
      );
    }
    if (getUser.role === "admin") {
      return response(true, 200, "Please Enter the Admin Login Code.");
    }
    //OTP Generation
    await OTPModel.deleteMany({ email }); // deleting old otps
    const otp = generateOTP();
    //store otp to database;
    const newOtpData = new OTPModel({
      email,
      otp,
    });
    await newOtpData.save();
    const otpEmailStatus = await sendOtpEmail(
      otp,
      email,
      process.env.NEXT_PUBLIC_BASE_URL,
    );
    if (!otpEmailStatus.success) {
      return response(false, 400, "Failed to send OTP.");
    }
    return response(true, 200, "OTP sent to your registered Email.");
  } catch (error) {
    console.log(error);
    return catchError(error);
  }
}
