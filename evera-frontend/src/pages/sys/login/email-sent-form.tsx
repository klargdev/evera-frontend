import userService, { type ForgotPasswordReq } from "@/api/services/userService";
import { Button } from "@/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/login-provider";
import { toast } from "sonner";
import { Loader2, Mail, Clock, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Icon } from "@/components/icon";

interface EmailSentFormProps {
	email: string;
}

function EmailSentForm({ email }: EmailSentFormProps) {
	const { t } = useTranslation();
	const { backToLogin } = useLoginStateContext();
	const [resendCountdown, setResendCountdown] = useState(0);

	const resendMutation = useMutation({
		mutationFn: userService.forgotPassword,
	});

	const handleResend = async () => {
		try {
			await resendMutation.mutateAsync({ email });
			toast.success("Reset link sent again! Please check your email.", {
				closeButton: true,
				duration: 5000,
			});
			// Start countdown for 60 seconds
			setResendCountdown(60);
			const interval = setInterval(() => {
				setResendCountdown((prev) => {
					if (prev <= 1) {
						clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		} catch (error) {
			// Error is handled by the API client interceptor
		}
	};

	return (
		<>
			<div className="mb-8 text-center">
				<Icon icon="local:ic-reset-password" size="100" className="text-primary!" />
			</div>
			<div className="space-y-6">
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<Mail className="h-8 w-8 text-primary" />
					</div>
					<h1 className="text-2xl font-bold">Check Your Email</h1>
					<p className="text-balance text-sm text-muted-foreground">
						We've sent a password reset link to{" "}
						<span className="font-medium text-foreground">{email}</span>
					</p>
				</div>

				<div className="rounded-lg border bg-muted/50 p-4">
					<div className="flex items-start gap-3">
						<Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
						<div className="space-y-1">
							<p className="text-sm font-medium">Reset Link Expires</p>
							<p className="text-xs text-muted-foreground">
								The password reset link will expire in 1 hour for security reasons.
							</p>
						</div>
					</div>
				</div>

				<div className="space-y-3">
					<Button 
						onClick={handleResend} 
						disabled={resendMutation.isPending || resendCountdown > 0}
						className="w-full"
						variant="outline"
					>
						{resendMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending...
							</>
						) : resendCountdown > 0 ? (
							<>
								<RefreshCw className="mr-2 h-4 w-4" />
								Resend in {resendCountdown}s
							</>
						) : (
							<>
								<RefreshCw className="mr-2 h-4 w-4" />
								Resend Reset Link
							</>
						)}
					</Button>

					<div className="text-center">
						<ReturnButton onClick={backToLogin} />
					</div>
				</div>

				<div className="text-center text-xs text-muted-foreground">
					<p>Didn't receive the email? Check your spam folder or</p>
					<p>make sure you entered the correct email address.</p>
				</div>
			</div>
		</>
	);
}

export default EmailSentForm; 