"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import {
  ADMIN_COUPON_SHOW,
  ADMIN_DASHBOARD,
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
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
const EditCoupon = ({params}) => {

  const {id} = use(params)
  const {data: getCouponData} = useFetch(`/api/coupon/get/${id}`)
  const [loading, setLoading] = useState(false);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_COUPON_SHOW, label: "Coupons" },
    { href: "", label: "Edit Coupon" },
  ];
  const formSchema = zSchema.pick({
    _id: true,
    discountPercentage: true,
    code: true,
    minShoppingAmount: true,
    validity: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        _id: id,
        code: "",
        minShoppingAmount:0,
        validity: "",
      discountPercentage: 0,
      
    },
  });
  useEffect(() => {
    if (getCouponData && getCouponData.success) {
      const coupon = getCouponData.data;
      form.reset({
        _id: coupon._id,
        code: coupon.code,
        minShoppingAmount: coupon.minShoppingAmount,
        validity: new Date(coupon.validity).toISOString().split('T')[0],
        discountPercentage: coupon.discountPercentage,

      });
    }
  }, [getCouponData, form]);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const submitData = {
        ...values,
        validity: new Date(values.validity)
      };
      const { data: response } = await axios.put(
        "/api/coupon/update",
        submitData,
      );
      if (!response.success) {
        throw new Error(response.message);
      }
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
          <h4 className="text-xl font-semibold">Edit Coupon</h4>
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
                text="Update Coupon"
                loading={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditCoupon;
