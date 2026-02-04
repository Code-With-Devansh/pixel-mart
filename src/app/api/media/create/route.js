import cloudinary from "@/lib/cloudinary";
import { connectDB } from "@/lib/DBconnect";
import { catchError, isAuthenticated, response } from "@/lib/helperFunction";
import MediaModel from "@/models/Media.model";

export async function POST(req) {
    const payload = await req.json();
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, "Unauthorised.");
        }
        await connectDB();
        const newMedia = await MediaModel.insertMany(payload)
        return response(true, 200, 'Media Uploaded Successfully.', newMedia)

    } catch (error) {
        if(payload && payload.length > 0){
            const publicIds = payload.map(data=>data.public_id);
            try {
                await cloudinary.api.delete_resources(publicIds);
            } catch (deleteError) {
                error.cloudinary = deleteError
            }
        }
        return catchError(error);
    }
}