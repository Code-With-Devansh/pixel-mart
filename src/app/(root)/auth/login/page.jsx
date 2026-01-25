"use client";

import Image from "next/image";
import React from "react";
import logo from "$/public/assets/images/logo-black.png";

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
import { Button } from "@/components/ui/button";
import ButtonLoading from "@/components/application/ButtonLoading";
import { Eye, EyeClosed } from "lucide-react";
import z from "zod";
import Link from "next/link";
import { WEBSITE_REGISTER } from "@/routes/WebsiteRoute";

const LoginPage = () => {
  const [loading, setLoading] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const formSchema = authSchema
    .pick({
      email: true,
    })
    .extend({
      password: z.string().min(3, "Password Field is required"),
    });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    console.log("Form Data:", data);
    setLoading(false);
  };

  return (
    <Card className="w-112.5">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Image src={logo} alt="logo" className="max-w-37.5" />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold">Login Into Account</h1>
          <p className="text-muted-foreground">
            Login into your account by filling out the form below.
          </p>
        </div>
        <div>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FieldGroup>
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
                          autoComplete="current-password"
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
            </FieldGroup>
            <div>
              <ButtonLoading
                className="w-full cursor-pointer"
                type="submit"
                text="Login"
                loading={loading}
                onClick={() => {}}
              />
            </div>
            <div className="text-center">
              <p>
                Don't have an account?{" "}
                <Link
                  href={WEBSITE_REGISTER}
                  className="text-blue-700 hover:underline"
                >
                  Register
                </Link>
              </p>
              <p className="mt-3">
                {" "}
                <Link
                  href="/auth/register"
                  className="text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
