"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_SHOW,
} from "@/routes/AdminPanelRoute";
import React, { useEffect, useState } from "react";
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/application/select";
import Editor from "@/components/application/admin/Editor";
import MediaModal from "@/components/application/admin/MediaModal";
import Image from "next/image";
const AddCoupon = () => {

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_COUPON_SHOW, label: "Coupons" },
    { href: "", label: "Add Coupon" },
  ];
  const formSchema = zSchema.pick({
    
    discountPercentage: true,
    code: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        code: "",
        minShoppingAmount:0,
        validity: "",
      discountPercentage: 0,
      
    },
  });
  
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data: response } = await axios.post(
        "/api/coupon/create",
        values,
      );
      if (!response.success) {
        throw new Error(response.message);
      }
      form.reset();
      showToast("success", response.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
    return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Add Coupon</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <Controller
                    name="code"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="alt">
                          Code <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="code"
                          type="text"
                          placeholder="Enter coupon code"
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
                    name="discountPercentage"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="discountPercentage">
                          Discount Percentage
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="discountPercentage"
                          type="number"
                          placeholder="Enter discount percentage"
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
                    name="minShoppingAmount"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="minShoppingAmount">
                          Minimum Shopping Amount
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="minShoppingAmount"
                          type="number"
                          placeholder="Enter minimum shopping amount"
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
                    name="validity"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="validity">
                          Validity Date
                          <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="validity"
                          type="date"
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              </div>
              
              
              
            </FieldGroup>

            <div>
              <ButtonLoading
                className="w-full cursor-pointer"
                type="submit"
                text="Add Coupon"
                loading={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCoupon;
