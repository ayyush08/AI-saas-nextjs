import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";



export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {  // response of type ApiResponse chahiye hi chahiye
    try {
        const res = await resend.emails.send({
            from: 'Inkognito@ayyush.me',
            to: email,
            subject: 'Verification Code for True Feedback Account',
            react: VerificationEmail({username,otp:verifyCode}),
        });
        console.log(res);
        
        return {
            success: true,
            message: "Verification email sent successfully",
        }
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        }
    }
}
