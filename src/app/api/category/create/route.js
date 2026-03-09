import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import CategoryModel from "@/models/Category.model";

export async function POST(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const payload = await req.json();
    const schema = zSchema.pick({
      slug: true,
      name: true,
    });
    const validateddata = schema.safeParse(payload);
    if(!validateddata.success){
        return response(false, 400, "missing or invalid input field.", validateddata.error);
    }
    const {name, slug} = validateddata.data;
    const newcategory = new CategoryModel({name, slug})
    await newcategory.save();
    return response(true, 200, "Category added successfully.");
  } catch (error) {
    return catchError(error);
  }
}
