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
import ButtonLoading from "@/components/application/ButtonLoading";
import z, { email } from "zod";
import Link from "next/link";
import { WEBSITE_LOGIN } from "@/routes/WebsiteRoute";
import axios from "axios";
import { showToast } from "@/lib/showToast";
import OTPVerification from "@/components/application/OTPVerification";
import UpdatePassword from "@/components/application/UpdatePassword";

const ResetPasword = () => {
  const [OTPVerificationLoading, setOTPVerificationLoading] = useState(false);
    const [otpEmail, setOtpEmail] = useState("")
    const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const formSchema = authSchema.pick({
    email: true,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleOtpVerification = async (values) => {
    try {
      setOTPVerificationLoading(true);
      const { data: otpVerificationResponse } = await axios.post(
        "/api/auth/reset-password/verify-otp",
        values,
      );
      if (!otpVerificationResponse.success) {
        throw new Error(otpVerificationResponse.message);
      }
      showToast("success", otpVerificationResponse.message);
      setIsOtpVerified(true)
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setOTPVerificationLoading(false);
    }
  };
  const handleEmailVerification = async (values) => {
    try {
      setLoading(true);
      const { data: otpResponse } = await axios.post(
        "/api/auth/reset-password/send-otp",
        values,
      );
      if (!otpResponse.success) {
        throw new Error(otpResponse.message);
      }
      setOtpEmail(values.email);
      showToast("success", otpResponse.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <Card className="w-112.5">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Image src={logo} alt="logo" className="max-w-37.5" />
          </div>
          {!otpEmail ? (
            <>
              <div className="text-center">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground">
                  Enter your email for password reset.
                </p>
              </div>
              <div>
                <form
                  onSubmit={form.handleSubmit(handleEmailVerification)}
                  className="space-y-4"
                >
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
                  </FieldGroup>
                  <div>
                    <ButtonLoading
                      className="w-full cursor-pointer"
                      type="submit"
                      text="Send OTP"
                      loading={loading}
                      onClick={() => {}}
                    />
                  </div>
                  <div className="text-center">
                    <Link
                      href={WEBSITE_LOGIN}
                      className="text-blue-700 hover:underline"
                    >
                      Back to Login.
                    </Link>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
            {!isOtpVerified ?
              <OTPVerification
                loading={OTPVerificationLoading}
                setOtpEmail={setOtpEmail}
                onSubmit={handleOtpVerification}
                email={otpEmail}
              />:
              <UpdatePassword email={otpEmail}/>
              }
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasword;
