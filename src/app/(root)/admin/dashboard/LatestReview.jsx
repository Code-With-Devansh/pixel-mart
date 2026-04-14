import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IoStar } from "react-icons/io5";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import imgplaceholder from "$/public/assets/images/img-placeholder.webp";
import { ReviewsTwoTone } from "@mui/icons-material";

const LatestReview = () => {
  const reviews = [
    {
      name: "lorem ipsum dolor sit amet",
      review: 5,
      img: imgplaceholder.src,
    },
    {
      name: "lorem ipsum dolor sit ame",
      review: 5,
      img: imgplaceholder.src,
    },
    {
      name: "lorem ipsum dolor sit a",
      review: 5,
      img: imgplaceholder.src,
    },
  ];
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Product</TableHead>
          <TableHead>Rating</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reviews.map((review) => (
          <TableRow key={review.name}>
            <TableCell className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={review.img} />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span className="line-clamp-1">{review.name}</span>
            </TableCell>
            <TableCell>
              <div className="flex items-center">
                {Array.from({ length: review.review }).map((_, index) => (
                  <span key={index}>
                    <IoStar key={index} className="text-yellow-500" />
                  </span>
                ))}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LatestReview;
