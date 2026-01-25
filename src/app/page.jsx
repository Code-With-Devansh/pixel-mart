import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from '@/routes/WebsiteRoute'
const page = () => {
  return (
    <div>
      <Link href={WEBSITE_LOGIN}>register</Link>
      <Link href={WEBSITE_REGISTER}>login</Link>
    </div>
  )
}

export default page