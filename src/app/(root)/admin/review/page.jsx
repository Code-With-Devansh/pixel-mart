'use client'
import {ADMIN_DASHBOARD, ADMIN_TRASH_VIEW,  } from '@/routes/AdminPanelRoute'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { useCallback, useMemo } from 'react'
import BreadCrumb from '@/components/application/admin/BreadCrumb';
import DatatableWrapper from '@/components/application/admin/DatatableWrapper';
import { columnConfig } from '@/lib/helperFunction';
import DeleteAction from '@/components/application/admin/DeleteAction';
import {   DT_REVIEW_COLUMN } from '@/lib/column';

const ShowReviews = () => {
    const breadCrumbData = [
        {href:ADMIN_DASHBOARD, label:'Home'},
        {href:'', label:'Reviews'},
    ]

    const columns = useMemo(()=>{
      return columnConfig(DT_REVIEW_COLUMN)
    }, [])

    const action = useCallback((row, DeleteType, handleDelete)=>{
      let actionMenu = []
      actionMenu.push(<DeleteAction handleDelete={handleDelete} row={row} deleteType={DeleteType} key='delete'/>)
      return actionMenu;
    }, [])
  return (
    <div><BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 gap-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <div className='flex justify-between items-center'>

          <h4 className="text-xl font-semibold">Reviews</h4>

          </div>
        </CardHeader>
        <CardContent className="pb-5 px-0">
          <DatatableWrapper
            querykey='review-data'
            fetchUrl='/api/review'
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint='/api/review/export'
            deleteEndpoint="/api/review/delete"
            deleteType='SD'
            trashView={ADMIN_TRASH_VIEW + '?trashof=review'}
            createAction={action}
          />
        </CardContent>
      </Card></div>
  )
}

export default ShowReviews