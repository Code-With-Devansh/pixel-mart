import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const orders = [
  {
    order_id: "INV001",
    payment_id: "Paid",
    items: "$250.00",
    status: "shipped",
    amount: "Credit Card",
  },
  {
    order_id: "INV002",
    payment_id: "Pending",
    items: "$150.00",
    status: "processing",
    amount: "PayPal",
  },
  {
    order_id: "INV003",
    payment_id: "Unpaid",
    items: "$350.00",
    status: "cancelled",
    amount: "Bank Transfer",
  },
  {
    order_id: "INV004",
    payment_id: "Paid",
    items: "$450.00",
    status: "shipped",  
    amount: "Credit Card",
  },
  {
    order_id: "INV005",
    payment_id: "Paid",
    items : "$550.00",
    status: "shipped",
    amount: "PayPal",
  },
  {
    order_id: "INV006",
    payment_id: "Pending",
    items: "$200.00",
    status: "processing",

    amount: "Bank Transfer",
  },
  {
    order_id: "INV007",
    payment_id: "Unpaid",
    items: "$300.00",
    status: "cancelled",

    amount: "Credit Card",
  },
]

export function LatestOrders() {
  return (
    <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Order Id</TableHead>
          <TableHead>Payment Id</TableHead>
          <TableHead>Items</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.order_id}>
            <TableCell className="font-medium">{order.order_id}</TableCell>
            <TableCell>{order.payment_id}</TableCell>
            <TableCell>{order.items}</TableCell>
            <TableCell className="text-right">{order.status}</TableCell>
            <TableCell className="text-right">{order.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
