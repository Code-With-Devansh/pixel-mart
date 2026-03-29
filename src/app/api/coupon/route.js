import { connectDB } from "@/lib/DBconnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import CouponModel from "@/models/Coupon.model";
import ProductModel from "@/models/Product.model";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const auth = await isAuthenticated("admin");
    if (!auth.isAuth) {
      return response(false, 403, "Unauthorised.");
    }
    await connectDB();
    const searchParams = req.nextUrl.searchParams;
    const start = parseInt(searchParams.get("start") || 0, 10);
    const size = parseInt(searchParams.get("size") || 10, 10);
    const filters = JSON.parse(searchParams.get("filters") || "[]");
    const globalFilter = searchParams.get("globalFilter") || "";
    const sorting = JSON.parse(searchParams.get("sorting") || "[]");
    const deleteType = searchParams.get("deleteType");

    let matchQuery = {};
    if (deleteType === "SD") {
      matchQuery.deletedAt = null;
    } else if (deleteType === "PD") {
      matchQuery.deletedAt = { $ne: null };
    }
    if (globalFilter) {
      matchQuery.$or = [
        { code: { $regex: globalFilter, $options: "i" } },

        {
            $expr:{
                $regexMatch: {
                    input: {$toString: "$minShoppingAmount"},
                    regex: globalFilter,
                    options: "i"
                }
            }
        },
        {
            $expr:{
                $regexMatch: {
                    input: {$toString: "$discountPercentage"},
                    regex: globalFilter,
                    options: "i"
                }
            }
        },
        { "categoryData.name": { $regex: globalFilter, $options: "i" } }
      ];
    }
    filters.forEach((filter) => {
        if(filter.id === 'minShoppingAmount' || filter.id === 'discountPercentage'){
            matchQuery[filter.id] = Number(filter.value);

        }else if(filter.id === 'validity'){
            matchQuery[filter.id] = new Date(filter.value)
        }else{
            matchQuery[filter.id] = { $regex: filter.value, $options: "i" };
        }
    });

    let sortQuery = {};

    sorting.forEach((sort) => {
      sortQuery[sort.id] = sort.desc ? -1 : 1;
    });

    // aggregation pipeline

    const aggregationPipeline = [
      
      {
        $match: matchQuery,
      },
      {
        $sort:
          Object.keys(sortQuery).length > 0 ? sortQuery : { createdAt: -1 },
      },
      {
        $skip: start,
      },
      {
        $limit: size,
      },
      {
        $project: {
          _id: 1,
          code: 1,
          validity: 1,
          minShoppingAmount: 1,
          discountPercentage: 1,
          createdAt: 1,
          deletedAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const getCoupons = await CouponModel.aggregate(aggregationPipeline);
    const totalCategories = await CouponModel.countDocuments(matchQuery);
    return NextResponse.json({
      data: getCoupons,
      meta: {
        totalRowCount: totalCategories,
      },
      success: true,
    });
  } catch (error) {
    return catchError(error);
  }
}
