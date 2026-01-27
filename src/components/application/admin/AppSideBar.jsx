'use client'
import React, { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";

import logoBlack from '$/public/assets/images/logo-black.png'
import logoWhite from '$/public/assets/images/logo-white.png'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import Link from 'next/link';
const AppSideBar = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);
  return (
    <Sidebar>
      <SidebarHeader className='border-b h-14 p-0'>
        <div className='flex justify-between items-center px-4'>
            {isDarkMode?
                <Image src={logoWhite.src} height={logoWhite.height} width={logoWhite.width} className='hidden dark:block h-12.5 w-auto' alt='logo-white'/>
                :
                <Image src={logoBlack.src} height={logoBlack.height} width={logoBlack.width} className='block dark:hidden h-12.5 w-auto' alt='logo-dark'/>
            }
            <Button type="button" size='icon' className='md:hidden'>
                <IoMdClose/>
            </Button>

        </div>
      </SidebarHeader>

      <SidebarContent className='p-3'>
        <SidebarMenu>
            {adminAppSidebarMenu.map((menu, index)=>(
                <Collapsible key={index} className='group/collapsible'>
                    <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton asChild className='font-semibold px-2 py-5'> 
                            <Link href={menu?.url}>
                                <menu.icon/>
                                {menu.title}
                                {menu.subMenu && menu.subMenu.length>0 && <LuChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90'/>}
                            </Link>
                          </SidebarMenuButton>
                        </CollapsibleTrigger>   

                        {menu.subMenu && menu.subMenu.length>0 && 
                        <CollapsibleContent>
                            <SidebarMenuSub> 
                                {menu.subMenu.map((val, index)=>(
                                    <SidebarMenuSubItem key={index}>
                                        <SidebarMenuSubButton asChild className='px-2 py-5'>
                                            <Link href={val.url}>
                                                {val.title}
                                            </Link>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        </CollapsibleContent>
}
                        
                    </SidebarMenuItem>
                </Collapsible>
            ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSideBar