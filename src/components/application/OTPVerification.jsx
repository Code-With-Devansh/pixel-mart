import { authSchema } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import ButtonLoading from "./ButtonLoading";

import { useForm, Controller } from "react-hook-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "../ui/input-otp";
import { Spinner } from "../ui/spinner";
import { showToast } from "@/lib/showToast";
import axios from "axios";
const OTPVerification = ({ email, onSubmit, loading, setOtpEmail }) => {
  const [isResendingOtp, setIsresendingOtp] = useState(false);
  const formSchema = authSchema.pick({
    otp: true,
    email: true,
  });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
      email,
    },
  });
  const handleOtpSubmit = async (values) => {
    onSubmit(values);
  };

  const handleLoginSubmit = async()=>{
    try {
      setIsresendingOtp(true);
      const {data: registerResponse} = await axios.post('/api/auth/resend-otp', {email});
      if(!registerResponse.success){
        throw new Error(registerResponse.message)
      }
      setOtpEmail(email)
      form.reset()
      showToast('success',registerResponse.message)
    } catch (error) {
      showToast('error',error.message)
    }finally{
      setIsresendingOtp(false);
    }
  }
  return (
    <div>
      <form onSubmit={form.handleSubmit(handleOtpSubmit)} className="space-y-4">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-2">Please Complete Verification</h1>
                <p className="text-md">We have sent an one-time password to your registered Email address. The OTP is valid for 10 minutes only.   </p>
            </div>
        <FieldGroup>
          <div className="mb-3">
            <Controller
              name="otp"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <div className="flex justify-center">
                  <FieldLabel htmlFor="otp" className="font-semibold">One-time Password (OTP)</FieldLabel>
                  </div>
                  <div className="flex justify-center">
                  <InputOTP maxLength={6} value={field.value} onChange={field.onChange}>
                    <InputOTPGroup>
                      <InputOTPSlot className="text-xl size-10" index={0} />
                      <InputOTPSlot className="text-xl size-10" index={1} />
                      <InputOTPSlot className="text-xl size-10" index={2} />
                      <InputOTPSlot className="text-xl size-10" index={3} />
                      <InputOTPSlot className="text-xl size-10" index={4} />
                      <InputOTPSlot className="text-xl size-10" index={5} />
                    </InputOTPGroup>
                  </InputOTP>
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
            text="Verify"
            loading={loading}
          />
          <div className="mt-5 flex justify-center">
            <div type="button" onClick={handleLoginSubmit} className="text-blue-600 cursor-pointer hover:underline">
              Resend OTP</div>
            {isResendingOtp && <Spinner className='animate-spin mt-1 mx-1'/>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OTPVerification;
