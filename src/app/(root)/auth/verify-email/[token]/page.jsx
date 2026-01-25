"use client";
import { Card, CardContent } from "@/components/ui/card";
import React, { use, useEffect, useState } from "react";
import verifiedImg from "$/public/assets/images/verified.gif";
import verifyfailed from "$/public/assets/images/verification-failed.gif";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WEBSITE_HOME } from "@/routes/WebsiteRoute";
import { Spinner } from "@/components/ui/spinner";
const page = ({ params }) => {
  const { token } = use(params);
  const [isVerified, setIsVerified] = useState(0);
  useEffect(() => {
    const verify = async () => {
      const { data: verificationResponse } = await axios.post(
        "/api/auth/verify-email",
        { token },
      );
      if (verificationResponse.success) {
        setIsVerified(1);
      }else{
        setIsVerified(2);
      }
    };
    verify();
  }, [token]);
  return (
    <Card className="w-[400px]">
      <CardContent>
        {isVerified ==1 ? (
          <div>
            <div className="flex justify-center items-center">
              <Image
                src={verifiedImg.src}
                height={100}
                width={100}
                alt="verified-success"
              />
            </div>
            <div className="text-center">
              <h1 className="2xl font-bold my-5">Email Verification Success</h1>
              <Button asChild>
                <Link href={WEBSITE_HOME}>Continue Shopping.</Link>
              </Button>
            </div>
          </div>
        ) : isVerified == 2 ? (
          <div>
            <div className="flex justify-center items-center text-green-600">
              <Image
                src={verifyfailed.src}
                height  ={100}
                width={100}
                alt="verification Failed"
              />
            </div>
            <div className="text-center">
              <h1 className="2xl font-bold my-5">Email Verification Failed!</h1>
            </div>
          </div>
        ):<div className="flex justify-center">
          <Spinner className="animate-spin my-6"></Spinner>
          <h1 className="2xl font-bold my-5 mx-2">Verification in process.</h1>
          </div>}
      </CardContent>
    </Card>
  );
};

export default page;
