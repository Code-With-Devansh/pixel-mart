import { connectDB } from "@/lib/DBconnect";
import { NextResponse } from "next/server";

export async function GET(){
    const connection = await connectDB();
    if(connection){
        return NextResponse.json({
            success: true,
            message: "Connectionn Successful"
        })
    }
}