import { connectDB } from "@/lib/DBconnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import ReviewModel from "@/models/Review.model";
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
        { "productData.name": { $regex: globalFilter, $options: "i" } },
        { "userData.name": { $regex: globalFilter, $options: "i" } },
        { rating: { $regex: globalFilter, $options: "i" } },
        { title: { $regex: globalFilter, $options: "i" } },
        { review: { $regex: globalFilter, $options: "i" } },
      ];
    }
    filters.forEach((filter) => {
      if(filter.id === 'product'){
        matchQuery['productData.name'] = { $regex: filter.value, $options: "i" };        
      }else if(filter.id === 'user'){
        matchQuery['userData.name'] = { $regex: filter.value, $options: "i" };
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
        $lookup: {
          from: "products",
          localField: "product",    
          foreignField: "_id",
          as: "productData",
        }
      },
      {
        $unwind: {
          path: "$productData", preservenullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",    
          foreignField: "_id",
          as: "userData",
        }
      },
      {
        $unwind: {
          path: "$userData", preservenullAndEmptyArrays: true
        }
      },
      {
        $unwind: {
          path: "$productData", preservenullAndEmptyArrays: true
        }
      },
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
          product:'$productData.name',
          user:'$userData.name',
          rating: 1,
          title: 1,
          review: 1,
          createdAt: 1,
          deletedAt: 1,
          updatedAt: 1,
        },
      },
    ];
    const getReviews = await ReviewModel.aggregate(aggregationPipeline);
    const totalRowCount = await ReviewModel.countDocuments(matchQuery);
    return NextResponse.json({
      data: getReviews,
      meta: {
        totalRowCount: totalRowCount,
      },
      success: true,
    });
  } catch (error) {
    return catchError(error);
  }
}
