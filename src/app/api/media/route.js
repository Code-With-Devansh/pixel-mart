import { connectDB } from "@/lib/DBconnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const auth = await isAuthenticated('admin');
        if(!auth.isAuth){
            return response(false, 403 , 'Unauthorised.');
        }
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const page = parseInt(searchParams.get('page'), 10) || 0;
        const limit = parseInt(searchParams.get('limit'), 10) || 10;
        const deleteType = searchParams.get('deleteType');   // SD => soft Delete, RSD => restore soft Delte, PD => permanent Delete
        let filter = {}
        if(deleteType === 'SD'){
            filter = {deletedAt:null};

        }else if(deleteType === 'PD'){
            filter = {deletedAt:{$ne:null}};

        }

        const mediaData = await MediaModel.find(filter).sort({createdAt:-1}).skip(page*limit).limit(limit).lean();
        const totalMedia = await MediaModel.countDocuments(filter);
        return NextResponse.json({
            mediaData, hasMore:((page+1) *limit <totalMedia)
        })


    } catch (error) {
        return catchError(error);
    }
}