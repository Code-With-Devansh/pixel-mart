import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import React from "react";

export const ModalMediaBlock = ({
  media,
  selectedMedia,
  setSelectedMedia,
  isMultiple,
}) => {
    
  const handleCheck = () => {
    let newSelectedmedia = [];
    const isSelected = selectedMedia.find((m) => m._id === media._id)
      ? true
      : false;

    if (isMultiple) {
      //select Multiple Media
      if (isSelected) {
        newSelectedmedia = selectedMedia.filter((m) => m._id !== media._id);
      } else {
        newSelectedmedia = [
          ...selectedMedia,
          { _id: media._id, secure_url: media.secure_url },
        ];
      }
      setSelectedMedia(newSelectedmedia);
    } else {
      setSelectedMedia([{ _id: media._id, secure_url: media.secure_url }]);
    }
  };
  return (
    <label
      htmlFor={media._id}
      className="border border-gray-200 dark:border-gray-800 relative rounded overflow-hidden cursor-pointer block"
    >
      <div className="absolute top-2 left-2 z-20">
        <Checkbox
          id={media._id}
          checked={
            selectedMedia.find((m) => m._id === media._id) ? true : false
          }
          onCheckedChange={handleCheck}
        />
      </div>
      <div className="w-full overflow-hidden" style={{ height: "150px" }}>
        <Image
          src={media.secure_url}
          alt={media.alt || ""}
          width={300}
          height={300}
          className="w-full h-full object-cover"
        />
      </div>
    </label>
  );
};
