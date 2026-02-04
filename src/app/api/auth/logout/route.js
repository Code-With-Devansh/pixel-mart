import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { cookies } from "next/headers";

export async function POST(req){
    try {
        await connectDB();
        const cookieStore = await cookies();
        cookieStore.delete('access_token');
        return response(true, 200, 'Logout Successful');
    } catch (error) {
        return catchError(error);
    }
}