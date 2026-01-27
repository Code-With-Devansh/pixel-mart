"use client";
import React from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/zodSchema";

import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Eye, EyeClosed } from "lucide-react";
import { showToast } from "@/lib/showToast";
import { useRouter } from "next/navigation";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import {z} from 'zod'

const UpdatePassword = ({email}) => {
    const router = useRouter()
  const [loading, setLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const formSchema = authSchema
    .pick({
        email:true,
      password: true
    }).extend({
    confirmPassword: z.string().min(1, "Confirm password is required"),
  }).refine((data)=>data.password === data.confirmPassword, {
        message:"Confirm Password and Password doesn't match.",
        path:['confirmPassword']
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email,
      password: "",
      confirmPassword:""
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const {data: registerResponse} = await axios.put('/api/auth/reset-password/update-password', values);
      if(!registerResponse.success){
        throw new Error(registerResponse.message)
      }
      form.reset()
      showToast('success', registerResponse.message)
      router.push(WEBSITE_LOGIN)
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false);  
    }
  };

  return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Update Password</h1>
          <p className="text-muted-foreground">
            create new password by filling the form below.
          </p>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <div className="mb-3">
                <Controller
                  name="password"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <div className="relative">
                        <Input
                          {...field}
                          id="password"
                          type={passwordVisible ? "text" : "password"}
                          placeholder="********"
                          autoComplete="new-password"
                          aria-invalid={fieldState.invalid}
                        />
                        <button
                          className="absolute bottom-2.5 right-2 w-auto"
                          type="button"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeClosed className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </div>
              <div className="mb-3">
                <Controller
                  name="confirmPassword"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                      <div>
                        <Input
                          {...field}
                          id="confirmPassword"
                          type={passwordVisible ? "text":"password"}
                          placeholder="********"
                          aria-invalid={fieldState.invalid}
                          autoComplete="new-password"
                        />
                      </div>
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
                text="Update Password"
                loading={loading}
                onClick={() => {}}
              />
            </div>
          </form>
        </div>
      </div>
  );
};

export default UpdatePassword;