"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
} from "@/routes/AdminPanelRoute";
import React, { use, useEffect, useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { zSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import  slugify  from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
const EditCategory = ({params}) => {
  const {id} = use(params);

    const [loading, setLoading] = useState(false);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Edit Category" },
  ];
  const formSchema = zSchema.pick({
    _id:true,
    slug:true, name:true
  });
  const {data:categoryData} = useFetch(`/api/category/get/${id}`);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id:id,
      name:"",
      slug:""
    },
  });
  useEffect(()=>{
    const name = form.getValues('name')
    if(name){
        form.setValue('slug', slugify(name).toLowerCase())
    }
  }, [form.watch('name')])

  useEffect(()=>{
    if(categoryData && categoryData.success ){
        form.reset({
              _id:categoryData.data?._id,
            name:categoryData.data?.name,
            slug:categoryData.data?.slug
        })
    }
  }, [categoryData])
  const onSubmit = async(values)=>{
    setLoading(true);
    try {
      const {data:response} = await axios.put('/api/category/update', values);
      if(!response.success){
        throw new Error(response.message);
      }
      form.reset(values); 
      showToast('success', response.message);
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false);
    }
  }

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Category</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <div className="mb-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="alt">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Enter category name"
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
                  name="slug"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="title">slug</FieldLabel>
                      <Input
                        {...field}
                        id="slug"
                        type="text"
                        placeholder="Enter slug"
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
                text="Update Category"
                loading={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCategory;
