import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";
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
      _id: true,
      media: true,
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
          discountPercentage: true,
      });
    const validateddata = schema.safeParse(payload);
    if(!validateddata.success){
        return response(false, 400, "missing or invalid input field.", validateddata.error);
    }
    const {_id,color, product, size, sku, mrp, sellingPrice, discountPercentage, media} = validateddata.data;
    const getVariant = await ProductVariantModel.findOne({_id, deletedAt:null});
    if(!getVariant){
        return response(false, 400, "Invalid product variant id.");
    }
    getVariant.color = color;
    getVariant.size = size;
    getVariant.sku = (sku);
    getVariant.product = product;
    getVariant.mrp = mrp;
    getVariant.sellingPrice = sellingPrice;
    getVariant.discountPercentage = discountPercentage;
    getVariant.media = media;
    await getVariant.save();
    return response(true, 200, "Product variant updated successfully."); 
  } catch (error) {
    return catchError(error);
  }
}
