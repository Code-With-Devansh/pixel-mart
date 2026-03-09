import * as React from "react";



export function OtpEmail({ otp, baseUrl }) {
  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "50px 0" }}>
      <table
        width="500"
        align="center"
        style={{
          backgroundColor: "#ffffff",
          margin: "0 auto",
          fontFamily: "Tahoma, Verdana, Segoe, sans-serif",
          textAlign: "center",
          paddingBottom: "20px",
          paddingTop: "15px",
        }}
      >
        <tbody>
          <tr>
            <td>
              <img
                src="https://res.cloudinary.com/dalepla4n/image/upload/v1769862850/otp-email_yaz2ho.webp"
                alt="reset-password"
                width="250"
                style={{ display: "block", margin: "0 auto" }}
              />
            </td>
          </tr>

          <tr>
            <td>
              <h1
                style={{
                  color: "#393d47",
                  fontSize: "25px",
                  fontWeight: "normal",
                  margin: "10px 0",
                }}
              >
                <strong>Email Verification</strong>
              </h1>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "10px 20px" }}>
              <p
                style={{
                  color: "#393d47",
                  fontSize: "14px",
                  lineHeight: "21px",
                  margin: 0,
                }}
              >
                We received a request to verify your identity. Use the
                following One-Time Password (OTP) to complete the verification
                process:
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <h1
                style={{
                  color: "#7747FF",
                  fontSize: "38px",
                  fontWeight: 700,
                  margin: "10px 0",
                }}
              >
                {otp}
              </h1>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "10px 20px" }}>
              <p
                style={{
                  color: "#393d47",
                  fontSize: "13px",
                  lineHeight: "19px",
                  margin: 0,
                }}
              >
                <strong>Note:</strong> This OTP is valid for 10 minutes. Do not
                share it with anyone.
              </p>

              <p
                style={{
                  color: "#393d47",
                  fontSize: "13px",
                  lineHeight: "19px",
                  margin: 0,
                }}
              >
                If you did not request this, please ignore this message.
              </p>

              <p
                style={{
                  color: "#393d47",
                  fontSize: "13px",
                  lineHeight: "19px",
                  marginTop: "8px",
                }}
              >
                Thank you,
                <br />
                <a href={baseUrl} target="_blank">
                  Pixel Mart
                </a>
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}