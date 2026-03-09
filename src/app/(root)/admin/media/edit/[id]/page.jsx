'use client'
import BreadCrumb from '@/components/application/admin/BreadCrumb';
import useFetch from '@/hooks/useFetch';
import React, {use, useEffect, useState} from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoute'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from '@/components/ui/input';
import { zSchema } from '@/lib/zodSchema';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ButtonLoading from '@/components/application/ButtonLoading';
import Image from 'next/image';
import imgPlaceHolder from '$/public/assets/images/img-placeholder.webp'
import { showToast } from '@/lib/showToast';
import axios from 'axios';
const EditMedia = ({params}) => {

  const breadCrumbData = [
    {
      href:ADMIN_DASHBOARD,
      label:"Home"
    },
    {
      href:ADMIN_MEDIA_SHOW,
      label:"Media"
    },
    {
      href:"",
      label:"Edit Media"
    },

  ]


  const {id} = use(params);
  const {data: mediaData} =  useFetch(`/api/media/get/${id}`)
  const [loading, setLoading] = useState(false);

  const formSchema = zSchema
    .pick({
      _id: true,
      alt:true,
      title:true
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      alt:"",
      title:""
    },
  });

  useEffect(()=>{
    if(mediaData && mediaData.success){
      const data = mediaData.data;
      form.reset({
        _id:data._id,
        alt:data.alt,
        title:data.title
      })
    }
  }, [mediaData]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const {data: response} = await axios.put('/api/media/update', values);
      if(!response.success){
        throw new Error(response.message)
      }
      showToast('success',response.message)
      
    } catch (error) {
      showToast('error',error.message)
    }finally{
      setLoading(false);
    }
  };

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData}/>
      <Card className="py-0 rounded shadow-sm ">
      <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
        <h4 className='text-xl font-semibold'>Edit Media</h4>
      </CardHeader>
      <CardContent className='pb-5'>
       <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className='mb-5'>
          <Image
            src={mediaData?.data?.secure_url || imgPlaceHolder}
            width={200}
            height={200}
            alt={mediaData?.alt || 'Image'}
          />
        </div>
            <FieldGroup>
              <div className="mb-3">
                <Controller
                  name="alt"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="alt">Alt</FieldLabel>
                      <Input
                        {...field}
                        id="alt"
                        type="text"
                        placeholder="Enter Alt"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  name="title"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">Title </FieldLabel>
                      <Input
                        {...field}
                        id="title"
                        type="text"
                        placeholder="Enter title"
                        aria-invalid={fieldState.invalid}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              
            </FieldGroup>
            <div>
              <ButtonLoading
                className="w-full cursor-pointer"
                type="submit"
                text="Update Media"
                loading={loading}
              />
            </div>
            
          </form>
        
      </CardContent>
    </Card>
    </div>
  )
}

export default EditMedia