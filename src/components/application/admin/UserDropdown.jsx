import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {IoShirtOutline} from 'react-icons/io5';
import { MdOutlineShoppingBag } from "react-icons/md";

import adminLogo from '$/public/assets/images/admin-logo.png'
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import { AiOutlineLogout } from "react-icons/ai";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import { logout } from "@/store/reducer/authReducer";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";

const ThemeSwitch = () => {
  const auth = useSelector((store)=>store.authStore.auth);
  const dispatch = useDispatch()
  const router = useRouter();
  const handleLogout = async ()=>{
    try {
      const {data:logoutResponse} = await axios.post('/api/auth/logout');
      if(!logoutResponse.success){
        throw new Error(logoutResponse.message);
      }
      dispatch(logout());
      showToast('success', logoutResponse.message);
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      showToast('error', error.message )
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
          <Avatar className='cursor-pointer'>
            <AvatarImage src={adminLogo.src} alt="@shadcn" />
          </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='me-5 w-44'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <p className="font-semibold">{auth?.name}</p>
          </DropdownMenuLabel>
        <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="" className="cursor-pointer"> <IoShirtOutline/>New Product</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="" className="cursor-pointer"> <MdOutlineShoppingBag/>Orders</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='cursor-pointer' onClick ={handleLogout}>
            <AiOutlineLogout color="red" />
                  <p className="text-red-600">Logout</p>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitch;
