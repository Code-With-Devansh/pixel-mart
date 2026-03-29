'use client'
import {ADMIN_DASHBOARD, ADMIN_PRODUCT_ADD, ADMIN_PRODUCT_EDIT, ADMIN_PRODUCT_SHOW, ADMIN_PRODUCT_VARIANT_ADD, ADMIN_PRODUCT_VARIANT_EDIT, ADMIN_PRODUCT_VARIANT_SHOW, ADMIN_TRASH_VIEW } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useCallback, useMemo } from 'react'
import BreadCrumb from '@/components/application/admin/BreadCrumb';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { FiPlus } from 'react-icons/fi';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/helperFunction';
import EditAction from '@/components/application/admin/EditAction';
import DeleteAction from '@/components/application/admin/DeleteAction';
import { DT_PRODUCT_VARIANT_COLUMN } from '@/lib/column';


const ShowProductVariant = () => {
    const breadCrumbData = [
        {href:ADMIN_DASHBOARD, label:'Home'},
        {href:ADMIN_PRODUCT_VARIANT_SHOW, label:'Product Variants'},
    ]

    const columns = useMemo(()=>{
      return columnConfig(DT_PRODUCT_VARIANT_COLUMN)
    }, [])

    const action = useCallback((row, DeleteType, handleDelete)=>{
      let actionMenu = []
      actionMenu.push(<EditAction href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)} key='edit'/>)
      actionMenu.push(<DeleteAction handleDelete={handleDelete} row={row} deleteType={DeleteType} key='delete'/>)
      return actionMenu;
    }, [])
  return (
    <div><BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 gap-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex justify-between items-center'>

          <h4 className="text-xl font-semibold">Show Product Variants</h4>
          <Button > 
            <FiPlus/>
            <Link href={ADMIN_PRODUCT_VARIANT_ADD}>New Product Variant</Link>
          </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            querykey='product-variant-data'
            fetchUrl='/api/product-variant'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/product-variant/export'
            deleteEndpoint="/api/product-variant/delete"
            deleteType='SD'
            trashView={ADMIN_TRASH_VIEW + '?trashof=product-variant'}
            createAction={action}
          />
        </CardContent>
      </Card></div>
  )
}

export default ShowProductVariant