import * as React from "react";

export function EmailVerificationTemplate({ link, baseUrl }) {
  return (
    <div style={{ backgroundColor: "#f5f5f5", padding: "50px 0" }}>
      <table
        width="500"
        align="center"
        style={{
          backgroundColor: "#ffffff",
          margin: "0 auto",
          textAlign: "center",
          fontFamily: "Tahoma, Verdana, Segoe, sans-serif",
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
                We received a request to verify your identity. Use the following
                link to complete the verification process:
              </p>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "20px" }}>
              <a
                href={link}
                style={{
                  backgroundColor: "#7747FF",
                  color: "#ffffff",
                  padding: "10px 30px",
                  textDecoration: "none",
                  borderRadius: "50px",
                  fontWeight: 700,
                }}
              >
                Verify
              </a>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "10px 20px" }}>
              <p
                style={{
                  color: "#393d47",
                  fontSize: "14px",
                  lineHeight: "21px",
                  marginBottom: "6px",
                }}
              >
                If the button above doesn’t work, copy and paste this link into
                your browser:
              </p>

              <a href={link}>{link}</a>
            </td>
          </tr>

          <tr>
            <td style={{ padding: "10px 20px" }}>
              <p
                style={{
                  color: "#393d47",
                  fontSize: "13px",
                  lineHeight: "19px",
                  margin: "10px 0",
                }}
              >
                <strong>Note:</strong> This link will expire in 1 hour. If you
                did not create an account, you can safely ignore this email.
              </p>

              <p
                style={{
                  color: "#393d47",
                  fontSize: "13px",
                  lineHeight: "19px",
                  margin: 0,
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
