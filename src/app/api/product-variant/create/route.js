
import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import { zSchema } from "@/lib/zodSchema";
import ProductVariantModel from "@/models/ProductVariant.model";

export async function POST(req) {
  const payload = await req.json();
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const schema = zSchema.pick({
      media: true,
        product: true,
        sku: true,
        color: true,
        size: true,
        mrp: true,
        sellingPrice: true,
          discountPercentage: true,
      });
    const validated = schema.safeParse(payload);
    if (!validated.success) {
      return response(
        false,
        400,
        "invalid or missing fields.",
        validated.error,
      );
    }
    const variantdata = validated.data;
    const newVariant = new ProductVariantModel({
      product: variantdata.product,
      color: variantdata.color,
      size: variantdata.size,
      sku: variantdata.sku,
      mrp: variantdata.mrp,
      sellingPrice: variantdata.sellingPrice,
      discountPercentage: variantdata.discountPercentage,
      media: variantdata.media,
    });
    await newVariant.save();
    return response(true, 200, "Product Variant Added Successfully.")
  } catch (error) {

    return catchError(error);
  }
}
