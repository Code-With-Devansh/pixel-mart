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
const EditProduct = ({params}) => {
  const {id} = use(params);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const { data: getCategoryData } = useFetch(
    "/api/category?deleteType=SD&size=10000",
  );
  const { data: getProductData , loading:getProductLoading} = useFetch(
    `/api/product/get/${id}`,
  );
  useEffect(() => {
    if (getCategoryData && getCategoryData.success) {
      const data = getCategoryData.data;
      const options = data.map((category) => ({
        label: category.name,
        value: category._id,
      }));
      setCategoryOptions(options);
    }
  }, [getCategoryData]);

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_PRODUCT_SHOW, label: "Products" },
    { href: "", label: "Edit Product" },
  ];
  const formSchema = zSchema.pick({
    _id:true,
    slug: true,
    category: true,
    mrp: true,
    sellingPrice: true,
    discountPercentage: true,
    description: true,
    name: true,
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: id,
      slug: "",
      category: "",
      mrp: 0,
      sellingPrice: 0,
      discountPercentage: 0,
      description: "",
      name: "",
    },
  });
  useEffect(() => {
    if (getProductData && getProductData.success) {
      const product = getProductData.data;
      form.reset({ 
        _id: product?._id, 
        name: product?.name,
        slug: product?.slug,
        category: product?.category,
        mrp: product?.mrp,
        sellingPrice: product?.sellingPrice,
        discountPercentage: product?.discountPercentage,
        description: product?.description,
      });
      if(product.media && product.media.length > 0){
        const media = product.media.map((mediaId) => ({
          _id: mediaId._id,
          secure_url: mediaId.secure_url,
        }));
        setSelectedMedia(media);
      }
    }
  }, [getProductData]);
  useEffect(() => {
    const name = form.getValues("name");
    if (name) {
      form.setValue("slug", slugify(name).toLowerCase());
    }
  }, [form.watch("name")]);
  useEffect(() => {
    const mrp = form.getValues("mrp") || 0;
    const sellingPrice = form.getValues("sellingPrice") || 0;
    if (mrp > 0 && sellingPrice > 0 && mrp > sellingPrice) {
      const discountPercentage = ((mrp - sellingPrice) / mrp) * 100;
      form.setValue("discountPercentage", discountPercentage.toFixed(2), {
        shouldDirty: true,
      });
    }else{
      form.setValue("discountPercentage", 0, {
        shouldDirty: true,
      });
    }
  }, [form.watch("mrp"), form.watch("sellingPrice")]);
  const onSubmit = async (values) => {
    setLoading(true);
    if (selectedMedia.length <= 0) {
      return showToast("error", "please select Media");
    }
    const mediaIds = selectedMedia.map((media) => media._id);
    values.media = mediaIds;
    try {
      const { data: response } = await axios.put(
        `/api/product/update`,
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
  const editor = (event, editor) => {
    const data = editor.getData();
    form.setValue("description", data, { shouldDirty: true });
  };
  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />
      <Card className="py-0 rounded shadow-sm ">
        <CardHeader className="pt-3 px-3 border-b [.border-b]:pb-2">
          <h4 className="text-xl font-semibold">Edit Product</h4>
        </CardHeader>
        <CardContent className="pb-5">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-3">
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="alt">
                          Name <span className="text-red-500">*</span>
                        </FieldLabel>
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
                        <FieldLabel htmlFor="title">
                          slug<span className="text-red-500">*</span>
                        </FieldLabel>
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
                <div className="mb-3">
                  <Controller
                    name="category"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="category">
                          Category <span className="text-red-500">*</span>
                        </FieldLabel>
                        <Select
                          options={categoryOptions}
                          selected={field.value}
                          setSelected={field.onChange}
                          isMulti={false}
                          placeholder="Select a category"
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
              <div className="mb-3">
                <Controller
                  name="description"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="description">
                        Description<span className="text-red-500">*</span>
                      </FieldLabel>
                      {!getProductLoading && (
                        <Editor onChange={editor} initialData={field.value} />
                      )}
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
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
                text="Save Changes"
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

export default EditProduct;