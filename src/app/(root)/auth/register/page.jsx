"use client";
import Image from "next/image";
import React from "react";
import logo from "$/public/assets/images/logo-black.png";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchema } from "@/lib/zodSchema";
import darkLogo from '$/public/assets/images/logo-white.png'
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Eye, EyeClosed } from "lucide-react";
import z from "zod";
import Link from "next/link";
import { WEBSITE_LOGIN, WEBSITE_REGISTER } from "@/routes/WebsiteRoute";
import { showToast } from "@/lib/showToast";

const Register = () => {
  const [loading, setLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const formSchema = authSchema
    .pick({
      email: true, password: true
    }).extend({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name must be at most 50 characters")
      .regex(/^[A-Za-z ]+$/, "Name can contain only letters and spaces"),
    confirmPassword:z.string()
    }).refine((data)=>data.password === data.confirmPassword, {
        message:"Confirm Password and Password doesn't match.",
        path:['confirmPassword']
    })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name:"",
      email: "",
      password: "",
      confirmPassword:""
    },
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const {data: registerResponse} = await axios.post('/api/auth/register', values);
      if(!registerResponse.success){
        throw new Error(registerResponse.message)
      }
      form.reset()
      showToast('success', registerResponse.message)
    } catch (error) {
      showToast('error', error.message)
    }finally{
      setLoading(false);  
    }
  };

  return (
    <Card className="w-112.5">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Image src={logo} alt="logo" className="max-w-37.5 dark:hidden" />
          <Image src={darkLogo} alt="logo"  className="max-w-37.5 hidden dark:block"/>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-muted-foreground">
            Create your account by filling out the form below.
          </p>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
              <div className="mb-3">
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="name">Name</FieldLabel>
                      <Input
                        {...field}
                        id="name"
                        type="text"
                        placeholder="Your Name"
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
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="email">Email</FieldLabel>
                      <Input
                        {...field}
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        autoComplete="email"
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
                text="Create Account"
                loading={loading}
                onClick={() => {}}
              />
            </div>
            <div className="text-center">
              <p>
                have an account?{" "}
                <Link
                  href={WEBSITE_LOGIN}
                  className="text-blue-700 hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register