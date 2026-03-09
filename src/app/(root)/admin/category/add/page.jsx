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
import React, { useEffect, useState } from "react";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input";
import { authSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import  slugify  from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
const AddCategory = () => {
    const [loading, setLoading] = useState(false);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_CATEGORY_SHOW, label: "Category" },
    { href: "", label: "Add Category" },
  ];
  const formSchema = authSchema.pick({
    slug:true, name:true
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
  const onSubmit = async(values)=>{
    setLoading(true);
    try {
      const {data:response} = await axios.post('/api/category/create', values);
      if(!response.success){
        throw new Error(response.message);
      }
      form.reset(); 
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
          <h4 className="text-xl font-semibold">Add Category</h4>
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
                text="Add Category"
                loading={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCategory;
