
import { connectDB } from "@/lib/DBconnect";
import { catchError, response } from "@/lib/helperFunction";
import { isAuthenticated } from "@/lib/authentication";
import ProductModel from "@/models/Product.model";
import { zSchema } from "@/lib/zodSchema";
import { encode } from "entities";

export async function POST(req) {
  const payload = await req.json();
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const schema = zSchema.pick({
      slug: true,
      category: true,
      mrp: true,
      sellingPrice: true,
      discountPercentage: true,
      description: true,
      name: true,
      media: true,
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
    const productData = validated.data;
    const newProduct = new ProductModel({
      slug: productData.slug,
      category: productData.category,
      mrp: productData.mrp,
      sellingPrice: productData.sellingPrice,
      discountPercentage: productData.discountPercentage,
      description: encode(productData.description),
      name: productData.name,
      media: productData.media,
    });
    await newProduct.save();
    return response(true, 200, "Product Added Successfully.")
  } catch (error) {

    return catchError(error);
  }
}
