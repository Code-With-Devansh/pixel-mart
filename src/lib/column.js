import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Chip } from "@mui/material"
import userIcon from '$/public/assets/images/user.png'
export const DT_CATEGORY_COLUMN = [
    {
        accessorKey:'name',
        header:'Category Name'
    },
    {
        accessorKey:'slug',
        header:'Slug'
    },
]

export const DT_PRODUCT_COLUMN = [
    {
        accessorKey:'name',
        header:'Product Name'
    },
    {
        accessorKey:'slug',
        header:'Slug'
    },
    {
        accessorKey:'category',
        header:'Category'
    },
    {
        accessorKey:'mrp',
        header:'MRP'
    },
    {
        accessorKey:'sellingPrice',
        header:'Selling Price'
    },
    
    {
        accessorKey:'discountPercentage',
        header:'Discount (%)'
    },

]
export const DT_PRODUCT_VARIANT_COLUMN = [
    {
        accessorKey:'product',
        header:'Product Name'
    },
    {
        accessorKey:'color',
        header:'Color'
    },
    {
        accessorKey:'size',
        header:'Size'
    },
    {
        accessorKey:'mrp',
        header:'MRP'
    },
    {

        accessorKey:'sku',
        header:'SKU'
    },
    {
        accessorKey:'sellingPrice',
        header:'Selling Price'
    },
    
    {
        accessorKey:'discountPercentage',
        header:'Discount (%)'
    },
]
export const DT_COUPON_COLUMN = [
    {
        accessorKey:'code',
        header:'Coupon Code'

    
    },
    {
        accessorKey:'discountPercentage',
        header:'Discount (%)'
    },
    {
        accessorKey:'minShoppingAmount',
        header:'Minimum Shopping Amount'
    },
    {
        accessorKey:'validity',
        header:'Validity',
        Cell:({row})=>{
            let date = new Date(row.original.validity)
            return new Date() >  date? <Chip color="error" label={date.toLocaleDateString('en-IN')}/> : <Chip color="success" label={date.toLocaleDateString('en-IN')}/>
        }
    },
]
  
export const DT_CUSTOMERS_COLUMN = [
    {
        accessorKey:'avatar',
        header:'Avatar',
        Cell: ({row})=>{
            return <Avatar>
                <AvatarImage src={row.original.url || userIcon.src} alt={row.original.name}/>
            </Avatar> 
        }

    
    },
    {
        accessorKey:'name',
        header:'Name'
    },
    {
        accessorKey:'email',
        header:'Email'
    },
    {
        accessorKey:'phone',
        header:'Phone'
    },
    {
        accessorKey:'address',
        header:'Address'
    },
    {
        accessorKey:'isEmailVerified',
        header:'is Verified',
        Cell: ({row})=>{
            return row.original.isEmailVerified ? <Chip color="success" label="Verified"/> : <Chip color="error" label="Not Verified"/>
        }
    },
]
  