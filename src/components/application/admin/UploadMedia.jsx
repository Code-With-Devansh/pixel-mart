'use client'
import React from "react";
import { CldUploadWidget } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import {FiPlus} from 'react-icons/fi'
import { showToast } from "@/lib/showToast";
import axios from "axios";
const UploadMedia = ({isMultiple}) => {
    const handleOnError = ()=>{
        showToast('error', error.statusText);
    }
    const handleOnQueueEnd = async(results)=>{
        const files = results.info.files;
        const uploadedFiles = files.filter(file=>file.uploadInfo).map(file=>({
          asset_id: file.uploadInfo.asset_id,
          public_id: file.uploadInfo.public_id,
          path: file.uploadInfo.path,
          secure_url: file.uploadInfo.secure_url,
          thumbnail_url: file.uploadInfo.thumbnail_url,

        }))
        if(uploadedFiles.length > 0){
          try {
            const {data:mediaResponse} = await axios.post('/api/media/create',uploadedFiles);
            if(!mediaResponse.success){
              throw new Error(mediaResponse.message);

            }
            showToast('success', mediaResponse.message);

          } catch (error) {
            showToast('error', error.message)
          }
        }
    }
  return (
    <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
     signatureEndpoint='/api/cloudinary-signature'
     onError={handleOnError}
     onQueuesEnd={handleOnQueueEnd}
     config={{
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
     }}
     options={{
        multiple: isMultiple,
        sources: ['local', 'url', 'unsplash', 'google_drive'],

     }}
      >
        
      {({ open }) => {
        return <Button onClick={()=>open()} className='cursor-pointer'>
            <FiPlus/>
            Upload Media
        </Button>;
      }}
    </CldUploadWidget>
  );
};

export default UploadMedia;
