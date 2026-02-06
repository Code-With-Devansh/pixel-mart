
import BreadCrumb from '@/components/application/admin/BreadCrumb'
import UploadMedia from '@/components/application/admin/UploadMedia'
import { Card, CardHeader } from '@/components/ui/card'
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoute'
import React from 'react'

const breadCrumbData = [
    {href:ADMIN_DASHBOARD, label:'Home'},
    {href:'', label:'Media'},
]

const MediaPage = () => {
  return (
    <>
    <BreadCrumb breadCrumbData={breadCrumbData}/>
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <h4 className='font-semibold text-xl uppercase'>Media</h4>
          <div className='flex text-center gap-5'>
            <UploadMedia/>
          </div>
        </div>
      </CardHeader>
    </Card>
    </>
  )
}

export default MediaPage