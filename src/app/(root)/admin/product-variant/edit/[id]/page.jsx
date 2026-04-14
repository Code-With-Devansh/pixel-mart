"use client";
import BreadCrumb from "@/components/application/admin/BreadCrumb";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Controller } from "react-hook-form";
import {
  ADMIN_CATEGORY_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_PRODUCT_VARIANT_SHOW,
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
import slugify from "slugify";
import { showToast } from "@/lib/showToast";
import axios from "axios";
import useFetch from "@/hooks/useFetch";
import Select from "@/components/application/select";
import Editor from "@/components/application/admin/Editor";
import MediaModal from "@/components/application/admin/MediaModal";
import Image from "next/image";
import { sizes } from "@/lib/utils";
const EditProductVariant = ({params}) => {
  const {id} = use(params);
  const [productOptions, setproductOptions] = useState([]);
  const { data: getProduct } = useFetch(
    "/api/product?deleteType=SD&size=10000",
  );
  const { data: getProductVariant } = useFetch(
    `/api/product-variant/get/${id}`,
  );
  useEffect(() => {
    if (getProductVariant && getProductVariant.success) {
      const data = getProductVariant.data;
      form.reset({
        _id:data._id,
        product:data.product,
        sku:data.sku,
        color:data.color,
        size:data.size,
        mrp:data.mrp,
        sellingPrice:data.sellingPrice,
        discountPercentage:data.discountPercentage,
      });
      setSelectedMedia(data.media);
    }
      }, [getProductVariant]);
  useEffect(() => {
    if (getProduct && getProduct.success) {
      const data = getProduct.data;
      const options = data.map((product) => ({
        label: product.name,
        value: product._id,
      }));
      setproductOptions(options);
    }
  }, [getProduct]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
    { href: "", label: "Edit Product Variant" },
  ];
  const formSchema = zSchema.pick({
    _id: true,
    product: true,
    sku: true,
    color: true,
    size: true,
    mrp: true,
    sellingPrice: true,
      discountPercentage: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id:id,
    product:"",
    sku:"",
    color:"",
    size:"",
    mrp:"",
    sellingPrice:"",
    discountPercentage:"",
    },
  });
  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;
    if (mrp > 0 && sellingPrice > 0 && mrp > sellingPrice) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", discountPercentage.toFixed(2), {
        shouldDirty: true,
      });
    } else {
      form.setValue("discountPercentage", 0, {
        shouldDirty: true,
      });
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      if (selectedMedia.length <= 0) {
        throw new Error("error", "please select Media");
      }
      const mediaIds = selectedMedia.map((media) => media._id);
      values.media = mediaIds;
      const { data: response } = await axios.put(
        "/api/product-variant/update",
        values,
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
          <h4 className="text-xl font-semibold">Edit Product Variant</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <Controller
                    name="product"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="product">
                          Product <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          options={productOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                          placeholder="Select a product"
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
                    name="sku"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="sku">
                          SKU <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="sku"
                          type="text"
                          placeholder="Enter SKU"
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
                    name="color"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">
                          color<span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="color"
                          type="text"
                          placeholder="Enter color"
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
                    name="size"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">
                          Size<span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          options={sizes}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                          placeholder="Select a product"
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
                    name="mrp"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">
                          MRP<span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="mrp"
                          type="number"
                          placeholder="Enter MRP"
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
                    name="sellingPrice"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="sellingPrice">
                          Selling Price<span className="text-red-500">*</span>
                        </FieldLabel>
                        <Input
                          {...field}
                          id="sellingPrice"
                          type="number"
                          placeholder="Enter selling price"
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
                          readOnly
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
              </div>
              {selectedMedia.length > 0 && (
                <div className="flex justify-center items-center flex-wrap mb-3 gap-2">
                  {selectedMedia.map((media) => (
                    <div
                      className="overflow-hidden border rounded"
                      key={media._id}
                      style={{ height: "96px", width: "96px" }}
                    >
                      <Image
                        src={media.secure_url}
                        alt={media.alt || ""}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
              <div className="border border-dashed mb-3 rounded p-5 text-center">
                <div
                  onClick={() => setOpen(true)}
                  className="bg-gray-50 dark:bg-card border w-50 mx-auto p-5 cursor-pointer"
                >
                  <span className="font-semibold">Select Media</span>
                </div>
              </div>
            </FieldGroup>

            <div>
              <ButtonLoading
                className="w-full cursor-pointer"
                type="submit"
                text="Update Product Variant"
                loading={loading}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      <MediaModal
        open={open}
        setOpen={setOpen}
        selectedMedia={selectedMedia}
        setSelectedMedia={setSelectedMedia}
        isMultiple={true}
      />
    </div>
  );
};

export default EditProductVariant;
