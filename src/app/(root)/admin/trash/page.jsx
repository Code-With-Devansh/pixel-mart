'use client'
import { ADMIN_DASHBOARD, ADMIN_TRASH_VIEW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useCallback, useMemo } from 'react'
import BreadCrumb from '@/components/application/admin/BreadCrumb';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/helperFunction';
import DeleteAction from '@/components/application/admin/DeleteAction';
import { DT_CATEGORY_COLUMN, DT_COUPON_COLUMN, DT_CUSTOMERS_COLUMN, DT_PRODUCT_COLUMN, DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column';
import { useSearchParams } from 'next/navigation';

const TRASH_CONFIG = {
  category:{
    title:"Category Trash",
    columns:DT_CATEGORY_COLUMN,
    fetchUrl:'/api/category', 
    exportUrl:'/api/category/export',
    deleteUrl:'/api/category/delete',
  },
  product:{
    title:"Product Trash",
    columns:DT_PRODUCT_COLUMN,
    fetchUrl:'/api/product', 
    exportUrl:'/api/product/export',
    deleteUrl:'/api/product/delete',
  },
  "product-variant":{
    title:"Product Variant Trash",
    columns:DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl:'/api/product-variant', 
    exportUrl:'/api/product-variant/export',
    deleteUrl:'/api/product-variant/delete',
  },
  coupon:{
    title:"Coupon Trash",
    columns:DT_COUPON_COLUMN,
    fetchUrl:'/api/coupon', 
    exportUrl:'/api/coupon/export',
    deleteUrl:'/api/coupon/delete',
  },
  customers:{
    title:"Customer Trash",
    columns:DT_CUSTOMERS_COLUMN,
    fetchUrl:'/api/customers', 
    exportUrl:'/api/customers/export',
    deleteUrl:'/api/customers/delete',
  },


}
const breadCrumbData = [
    {href:ADMIN_DASHBOARD, label:'Home'},
    {href:ADMIN_TRASH_VIEW, label:'Trash'},
]
const Trash = () => {

  const searchParams = useSearchParams();
  const trashOf = searchParams.get('trashof');
  const config = TRASH_CONFIG[trashOf]
    const columns = useMemo(()=>{
      return columnConfig(config.columns, false, false, true)
    }, [])

    const action = useCallback((row, DeleteType, handleDelete)=>{
      return [<DeleteAction handleDelete={handleDelete} row={row} deleteType={DeleteType} key='delete'/>]
    }, [])
  return (
    <div><BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 gap-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex justify-between items-center'>

          <h4 className="text-xl font-semibold">{config.title}</h4>

          </div>
        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            querykey={trashOf + '-data-deleted'}
            fetchUrl={config.fetchUrl}
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType='PD'
            createAction={action}
          />
        </CardContent>
      </Card></div>
  )
}

export default Trash