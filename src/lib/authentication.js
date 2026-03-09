import { jwtVerify } from "jose";
import { cookies } from "next/headers";
export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has("access_token")) {
      return {
        isAuth: false,
      };
    }
    const access_token = cookieStore.get("access_token");

    const { payload } = await jwtVerify(
      access_token.value,
      new TextEncoder().encode(process.env.SECRET_KEY),
    );
    return {
      isAuth: payload.role === role,
      userId: payload._id,
    };
  } catch (error) {
    return {
      isAuth: false,
    };
  }
};