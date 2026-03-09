import { connectDB } from "@/lib/DBconnect";
import { isAuthenticated } from "@/lib/authentication";
import { catchError, response } from "@/lib/helperFunction";
import CategoryModel from "@/models/Category.model";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const auth = await isAuthenticated('admin')
        if(!auth.isAuth){
            return response(false, 403, "Unauthorised.");
        }
        await connectDB();
        const searchParams = req.nextUrl.searchParams;
        const start = parseInt(searchParams.get('start') || 0, 10);
        const size = parseInt(searchParams.get('size') || 10, 10);
        const filters = JSON.parse(searchParams.get('filters') || "[]"); 
        const globalFilter = searchParams.get('globalFilter') || "";
        const sorting = JSON.parse(searchParams.get('sorting') || "[]");
        const deleteType = searchParams.get('deleteType');

        let matchQuery = {}
        if(deleteType === 'SD'){
            matchQuery.deletedAt = null;
        }else if(deleteType === 'PD'){
            matchQuery.deletedAt = {$ne:null};
        }
        if(globalFilter){
            matchQuery.$or = [
                {name:{$regex:globalFilter, $options:'i'}},
                {slug:{$regex:globalFilter, $options:'i'}}
            ]   
        }
        filters.forEach(filter => {
            matchQuery[filter.id] = {$regex: filter.value, $options:'i'}
        });

        let sortQuery = {}

        sorting.forEach(sort => {
            sortQuery[sort.id] = sort.desc ? -1 : 1
        });

        // aggregation pipeline

        const aggregationPipeline = [
            {
                $match: matchQuery
            },
            {
                $sort: Object.keys(sortQuery).length > 0 ? sortQuery : {createdAt:-1}
            },
            {
                $skip: start
            },
            {
                $limit: size
            },
            {
                $project: {
                    _id:1,
                    name:1,
                    slug:1,
                    createdAt:1,
                    deletedAt:1,
                    updatedAt:1
                }
            }   
        ]
        const categoryData = await CategoryModel.aggregate(aggregationPipeline);
        const totalCategories = await CategoryModel.countDocuments(matchQuery);
        return NextResponse.json({data:categoryData, meta: {
            totalRowCount: totalCategories,

        },success:true})

    } catch (error) {
        return catchError(error); 
    }    
}