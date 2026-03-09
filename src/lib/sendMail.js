// import nodeMailer from 'nodemailer'
// export const sendMail = async(subject, reciever, body)=>{
//     const transporter = nodeMailer.createTransport({
//         host:process.env.NODEMAILER_HOST,
//         port:process.env.NODEMAILER_PORT,
//         secure: false,
//         auth:{
//             user:process.env.NODEMAILER_EMAIL,
//             pass:process.env.NODEMAILER_PASSWORD
//         }

//     })
//     const options = {
//         from: `"Pixel Mart" <${process.env.NODEMAILER_EMAIL}>`,
//         to: reciever,
//         subject: subject,
//         html: body
//     }

//     try {
//         await transporter.sendMail(options);
//         return {success: true}
//     } catch (error) {
//     console.error("Mail error:", error);
//     return {success:false, message:error.message}
// }
// }

import { OtpEmail } from "@/components/application/OTPEmail";
import { EmailVerificationTemplate } from "@/components/application/VerificationLinkEmail";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(otp, reciever, baseUrl) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Pixel Mart <no-reply@pixel-mart.in>",
      to: [reciever],
      subject: "Email Verification",
      react: OtpEmail({ otp, baseUrl }),
    });

    if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 });
    }
    
    return { success: true, data };
} catch (error) {
      console.log(error)
    return { success: false, error };
  }
}

export async function sendEmailVerification(verificationlink, reciever, baseUrl) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Pixel Mart <no-reply@pixel-mart.in>",
      to: [reciever],
      subject: "Email Verification",
      react: EmailVerificationTemplate({ link: verificationlink, baseUrl }),
    });

    if (error) {
        console.log(error)
        return Response.json({ error }, { status: 500 });
    }
    
    return { success: true, data };
} catch (error) {
      console.log(error)
    return { success: false, error };
  }
}


