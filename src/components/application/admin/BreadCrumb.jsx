import React from 'react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
const BreadCrumb = ({breadCrumbData}) => {
  return (
    <Breadcrumb className="mb-5">
  <BreadcrumbList>
  {breadCrumbData && breadCrumbData.length>0 && breadCrumbData.map((data, index)=>{
    return (<>
        <BreadcrumbItem>
      <BreadcrumbLink href={data.href} key={index} >{data.label}</BreadcrumbLink>
    </BreadcrumbItem>
    {(index != breadCrumbData.length-1) && <BreadcrumbSeparator className='mt-1'/>}</>
    )
  })}
    
  </BreadcrumbList>
</Breadcrumb>
  )
}

export default BreadCrumb