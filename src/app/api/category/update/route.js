import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { authSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const payload = await req.json();
    const schema = authSchema.pick({
      _id:true,
      slug: true,
      name: true,
    });
    const validateddata = schema.safeParse(payload);
    if(!validateddata.success){
        return response(false, 400, "missing or invalid input field.", validateddata.error);
    }
    const {_id, name, slug} = validateddata.data;
    const getCategory = await CategoryModel.findOne({_id, deletedAt:null});
    if(!getCategory){
        return response(false, 400, "Invalid category id.");
    }
    getCategory.name = name;
    getCategory.slug = slug;
    await getCategory.save();
    return response(true, 200, "Category updated successfully."); 
  } catch (error) {
    return catchError(error);
  }
}
