import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
})

export async function sendVerificationEmail(
    userEmail: string,
    userName: string,
    userId: string
) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    // Assuming the app is running on localhost:3000 for dev, updated for prod via env
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verifyUrl = `${baseUrl}/api/verify-user?id=${userId}`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: adminEmail,
        subject: `New User Sign Up: ${userName}`,
        html: `
      <h2>New User Registration</h2>
      <p>A new user has signed up and needs verification.</p>
      <p><strong>Name:</strong> ${userName}</p>
      <p><strong>Email:</strong> ${userEmail}</p>
      <p><strong>User ID:</strong> ${userId}</p>
      <br/>
      <a href="${verifyUrl}" style="background-color: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Verify User
      </a>
      <p>Or click this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
    }

    await transporter.sendMail(mailOptions)
}

export async function sendOrganizationVerificationEmail(
    organizationName: string,
    organizationId: string,
    recruiterEmail: string,
    recruiterName: string
) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verifyUrl = `${baseUrl}/api/verify-organization?id=${organizationId}`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: adminEmail,
        subject: `New Organization Registration: ${organizationName}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <h2>New Organization Registration</h2>
                <p>A new recruiter organization has been created and needs verification.</p>
                
                <div style="background: #f4f4f4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin-top: 0;">Organization Details</h3>
                    <p><strong>Organization Name:</strong> ${organizationName}</p>
                    <p><strong>Organization ID:</strong> ${organizationId}</p>
                    <p><strong>Recruiter Name:</strong> ${recruiterName || "Not provided"}</p>
                    <p><strong>Recruiter Email:</strong> ${recruiterEmail}</p>
                </div>
                
                <div style="margin: 30px 0;">
                    <a href="${verifyUrl}" 
                       style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                        Verify Organization
                    </a>
                </div>
                
                <p style="color: #666; font-size: 14px;">Or click this link: <a href="${verifyUrl}">${verifyUrl}</a></p>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

export async function sendOTPEmail(email: string, otp: string) {
    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: email,
        subject: "Your Login OTP",
        text: `Your OTP is ${otp}`,
        html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto;">
                <p>Use the following code to sign in or sign up to Edora Tracker:</p>
                <div style="font-size: 24px; font-weight: bold; background: #f4f4f4; padding: 10px; text-align: center; border-radius: 5px; margin: 20px 0;">
                    ${otp}
                </div>
                <p>This code will expire in 10 minutes.</p>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

export async function sendMentorVerificationEmail(
    mentorName: string,
    mentorEmail: string,
    mentorId: string,
    expertise: string[],
    yearsOfExperience: number | null,
    mentorshipTopics: string[],
    verificationToken: string
) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const approveUrl = `${baseUrl}/api/verify-mentor?token=${verificationToken}&id=${mentorId}&action=approve`
    const rejectUrl = `${baseUrl}/api/verify-mentor?token=${verificationToken}&id=${mentorId}&action=reject`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: adminEmail,
        subject: `🎓 New Mentor Application: ${mentorName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Mentor Application</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">A professional has applied to become a mentor on Edora</p>
                </div>

                <!-- Body -->
                <div style="padding: 32px;">
                    <!-- Mentor Info Card -->
                    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
                        <h2 style="color: #166534; margin: 0 0 16px 0; font-size: 18px;">Applicant Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;"><strong>Name:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${mentorName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${mentorEmail}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;"><strong>Experience:</strong></td>
                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">${yearsOfExperience ? `${yearsOfExperience} years` : "Not specified"}</td>
                            </tr>
                        </table>
                    </div>

                    <!-- Expertise -->
                    ${expertise.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 15px;">Areas of Expertise</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${expertise.map(skill => `<span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 13px;">${skill}</span>`).join("")}
                        </div>
                    </div>
                    ` : ""}

                    <!-- Mentorship Topics -->
                    ${mentorshipTopics.length > 0 ? `
                    <div style="margin-bottom: 24px;">
                        <h3 style="color: #374151; margin: 0 0 12px 0; font-size: 15px;">Mentorship Topics</h3>
                        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                            ${mentorshipTopics.map(topic => `<span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 20px; font-size: 13px;">${topic}</span>`).join("")}
                        </div>
                    </div>
                    ` : ""}

                    <!-- Action Buttons -->
                    <div style="text-align: center; margin: 32px 0 16px;">
                        <table style="margin: 0 auto; border-collapse: separate; border-spacing: 16px;">
                            <tr>
                                <td>
                                    <a href="${approveUrl}"
                                       style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(5,150,105,0.4);">
                                        ✅ Approve
                                    </a>
                                </td>
                                <td>
                                    <a href="${rejectUrl}"
                                       style="display: inline-block; background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 14px 36px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 14px rgba(220,38,38,0.4);">
                                        ❌ Reject
                                    </a>
                                </td>
                            </tr>
                        </table>
                    </div>

                    <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        Approve: <a href="${approveUrl}" style="color: #059669;">${approveUrl}</a><br/>
                        Reject: <a href="${rejectUrl}" style="color: #dc2626;">${rejectUrl}</a>
                    </p>
                </div>

                <!-- Footer -->
                <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                        This is an automated email from Edora Tracker. Mentor ID: ${mentorId}
                    </p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

export async function sendMentorApprovalNotification(
    mentorEmail: string,
    mentorName: string
) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const dashboardUrl = `${baseUrl}/dashboard/mentor/home`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: mentorEmail,
        subject: "🎉 Your Mentor Application Has Been Approved!",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%); padding: 40px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">🎓</div>
                    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">Welcome Aboard, ${mentorName}!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 15px;">Your mentor application has been approved</p>
                </div>

                <div style="padding: 32px;">
                    <p style="color: #374151; font-size: 15px; line-height: 1.7;">
                        Congratulations! After reviewing your qualifications and experience, we're thrilled to have you as a mentor on Edora Tracker.
                    </p>
                    <p style="color: #374151; font-size: 15px; line-height: 1.7;">
                        You now have full access to your mentor dashboard where you can manage your mentees, schedule sessions, and track your impact.
                    </p>

                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${dashboardUrl}"
                           style="display: inline-block; background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(5,150,105,0.4);">
                            Go to Dashboard →
                        </a>
                    </div>
                </div>

                <div style="background: #f9fafb; padding: 16px 32px; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="color: #9ca3af; font-size: 12px; margin: 0;">Edora Tracker — Empowering mentors and students</p>
                </div>
            </div>
        `,
    }

    await transporter.sendMail(mailOptions)
}

/**
 * Send Verification Email for Professional Role
 */
export async function sendProfessionalVerificationEmail(
    profName: string,
    profEmail: string,
    profId: string,
    expertise: string[],
    yearsOfExperience: number | null,
    verificationToken: string
) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com"
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const verifyUrl = `${baseUrl}/api/verify-professional?token=${verificationToken}&id=${profId}`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: adminEmail,
        subject: `💼 New Professional Application: ${profName}`,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%); padding: 32px; text-align: center;">
                    <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 700;">New Professional Application</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 14px;">An industry expert has applied for professional status</p>
                </div>
                <div style="padding: 32px;">
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 10px; padding: 24px; margin-bottom: 24px;">
                        <h2 style="color: #1e40af; margin: 0 0 16px 0; font-size: 18px;">Applicant Details</h2>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;"><strong>Name:</strong></td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${profName}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Email:</strong></td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${profEmail}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Experience:</strong></td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px;">${yearsOfExperience ? `${yearsOfExperience} years` : "Not specified"}</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div style="text-align: center; margin: 32px 0 16px;">
                    <a href="${verifyUrl}"
                       style="display: inline-block; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(30,64,175,0.4);">
                        ✅ Approve Professional
                    </a>
                </div>
            </div>
        `,
    }
    await transporter.sendMail(mailOptions)
}

/**
 * Send Approval Notification for Professional Role
 */
export async function sendProfessionalApprovalNotification(
    profEmail: string,
    profName: string
) {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const dashboardUrl = `${baseUrl}/dashboard/mentor-professional`

    const mailOptions = {
        from: process.env.EMAIL_FROM || '"Edora Tracker" <noreply@edora.com>',
        to: profEmail,
        subject: "🎉 Your Professional Account is Verified!",
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%); padding: 40px; text-align: center;">
                    <div style="font-size: 48px; margin-bottom: 12px;">💼</div>
                    <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">Welcome, ${profName}!</h1>
                    <p style="color: rgba(255,255,255,0.9); margin-top: 8px; font-size: 15px;">Your professional application has been approved</p>
                </div>
                <div style="padding: 32px;">
                    <p style="color: #334155; font-size: 15px; line-height: 1.7;">
                        Great news! Your account has been verified as a professional industry expert.
                    </p>
                    <div style="text-align: center; margin: 32px 0;">
                        <a href="${dashboardUrl}"
                           style="display: inline-block; background: linear-gradient(135deg, #1d4ed8, #3b82f6); color: white; padding: 14px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 14px rgba(30,64,175,0.4);">
                            Access Dashboard →
                        </a>
                    </div>
                </div>
            </div>
        `,
    }
    await transporter.sendMail(mailOptions)
}
