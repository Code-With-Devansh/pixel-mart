import { Button } from '@/components/ui/button';
import React from 'react'

import { IoIosSearch } from "react-icons/io";
import SearchModal from './SearchModal';
const AdminMobileSearch = () => {
    const [open, setOpen] = React.useState(false);
  return (
    <>
    <Button type="button" size='icon' onClick={()=>setOpen(true)} variant='ghost' className='md:hidden'>
        <IoIosSearch/>
    </Button>
    <SearchModal open = {open} setOpen={setOpen}/>
    </>
  )
}

export default AdminMobileSearch