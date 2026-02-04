
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
        <div className='flex justify-between items-center'></div>
      </CardHeader>
    </Card>
    </>
  )
}

export default MediaPage