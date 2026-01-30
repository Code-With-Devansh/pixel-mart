import BreadCrumb from '@/components/application/admin/BreadCrumb'
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
    </>
  )
}

export default MediaPage