"use client";

import Image from "next/image";
import React, { useState } from "react";
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
import { WEBSITE_HOME, WEBSITE_REGISTER, WEBSITE_RESET_PASSWORD } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/application/OTPVerification";
import {useDispatch} from 'react-redux';
import { login } from "@/store/reducer/authReducer";
import { useRouter, useSearchParams } from "next/navigation";
import { ADMIN_DASHBOARD } from "@/routes/AdminPanelRoute";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(false);
  const [OTPVerificationLoading, setOTPVerificationLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const [otpEmail, setOtpEmail] = useState("")
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
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const {data: loginResponse} = await axios.post('/api/auth/login', values);
      if(!loginResponse.success){
        throw new Error(loginResponse.message)
      }
      setOtpEmail(values.email)
      form.reset()
      showToast('success',loginResponse.message)
      
    } catch (error) {
      showToast('error',error.message)
    }finally{
      setLoading(false);
    }
  };
  //Otp verification
  const handleOtpVerification = async (values)=>{
    try {
      setOTPVerificationLoading(true);
      const {data: otpVerificationResponse} = await axios.post('/api/auth/verify-otp', values);
      if(!otpVerificationResponse.success){
        throw new Error(otpVerificationResponse.message)
      }
      setOtpEmail('')
      showToast('success',otpVerificationResponse.message)
      dispatch(login(otpVerificationResponse.data));
      if(searchParams.has('callback')){
        console.log('callback');
        router.push(searchParams.get('callback'));
      }else{
        console.log("OTP response data:", otpVerificationResponse.data);
console.log("Role:", otpVerificationResponse.data?.role);

        const url = otpVerificationResponse.data.role === 'admin'?ADMIN_DASHBOARD:WEBSITE_HOME
        router.push(url);
      }
    } catch (error) {
      showToast('error',error.message)
    }finally{
      setOTPVerificationLoading(false);
    }
  }
  return (
    <Card className="w-112.5">
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Image src={logo} alt="logo" className="max-w-37.5" />
        </div>
      {!otpEmail
      ?
      <><div className="text-center">
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
                  href={WEBSITE_RESET_PASSWORD}
                  className="text-blue-700 hover:underline"
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div></>
      :
      <>
      <OTPVerification loading={OTPVerificationLoading} setOtpEmail={setOtpEmail} onSubmit={handleOtpVerification} email={otpEmail} />
      </>
      }
        
      </CardContent>
    </Card>
  );
};

export default LoginPage;
