'use client'
import {ADMIN_DASHBOARD, ADMIN_COUPON_SHOW, ADMIN_TRASH_VIEW, ADMIN_COUPON_EDIT, ADMIN_COUPON_ADD } from '@/routes/AdminPanelRoute'
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
import { DT_COUPON_COLUMN } from '@/lib/column';

const ShowCoupons = () => {
    const breadCrumbData = [
        {href:ADMIN_DASHBOARD, label:'Home'},
        {href:ADMIN_COUPON_SHOW, label:'Coupons'},
    ]

    const columns = useMemo(()=>{
      return columnConfig(DT_COUPON_COLUMN)
    }, [])

    const action = useCallback((row, DeleteType, handleDelete)=>{
      let actionMenu = []
      actionMenu.push(<EditAction href={ADMIN_COUPON_EDIT(row.original._id)} key='edit'/>)
      actionMenu.push(<DeleteAction handleDelete={handleDelete} row={row} deleteType={DeleteType} key='delete'/>)
      return actionMenu;
    }, [])
  return (
    <div><BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 gap-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex justify-between items-center'>

          <h4 className="text-xl font-semibold">Show Coupon</h4>
          <Button > 
            <FiPlus/>
            <Link href={ADMIN_COUPON_ADD}>New Coupon</Link>
          </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            querykey='coupon-data'
            fetchUrl='/api/coupon'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/coupon/export'
            deleteEndpoint="/api/coupon/delete"
            deleteType='SD'
            trashView={ADMIN_TRASH_VIEW + '?trashof=coupon'}
            createAction={action}
          />
        </CardContent>
      </Card></div>
  )
}

export default ShowCoupons