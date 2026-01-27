import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { authSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function POST(req) {
  try {
    await connectDB();
    const payload = await req.json();
    const validationSchema = authSchema.pick({
      otp: true,
      email: true,
    });
    const validatedData = validationSchema.safeParse(payload);
    if (!validatedData.success) {
      return response(
        false,
        401,
        "invalid or missing otp.",
        validatedData.error,
      );
    }
    const { email, otp } = validatedData.data;
    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (getUser.role === "admin") {
      const loggedInUserData = {
        _id: getUser._id,
        role: getUser.role,
        name: getUser.name,
        avatar: getUser.avatar,
      };
      if (otp === process.env.ADMIN_CODE) {
        return response(true, 200, "Login Successful.", loggedInUserData);
      } else {
        return response(false, 401, "wrong admin code");
      }
    }
    const getOtpData = await OTPModel.findOne({ email, otp });
    if (!getOtpData) {
      return response(false, 401, "invalid or expired otp.");
    }
    if (!getUser) {
      return response(false, 401, "invalid or expired otp.");
    }
    const loggedInUserData = {
      _id: getUser._id,
      role: getUser.role,
      name: getUser.name,
      avatar: getUser.avatar,
    };
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);
    const cookieStore = await cookies();
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: process.env.NODE_ENV === "production",
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    //remove otp after validation
    await getOtpData.deleteOne();
    return response(true, 200, "Login Successfull.", loggedInUserData);
  } catch (e) {
    return catchError(e);
  }
}
