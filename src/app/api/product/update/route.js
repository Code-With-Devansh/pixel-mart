import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ProductModel from "@/models/Product.model";
import { encode } from "entities";

export async function PUT(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const payload = await req.json();
    const schema = zSchema.pick({
      _id:true,
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      name: true,
      media: true,
    });
    const validateddata = schema.safeParse(payload);
    if(!validateddata.success){
        return response(false, 400, "missing or invalid input field.", validateddata.error);
    }
    const {_id, name, slug, category, mrp, sellingPrice, discountPercentage, description, media} = validateddata.data;
    const getProduct = await ProductModel.findOne({_id, deletedAt:null});
    if(!getProduct){
        return response(false, 400, "Invalid product id.");
    }
    getProduct.name = name;
    getProduct.slug = slug;
    getProduct.category = category;
    getProduct.mrp = mrp;
    getProduct.sellingPrice = sellingPrice;
    getProduct.discountPercentage = discountPercentage;
    getProduct.description = encode(description);
    getProduct.media = media;
    await getProduct.save();
    return response(true, 200, "Product updated successfully."); 
  } catch (error) {
    return catchError(error);
  }
}
