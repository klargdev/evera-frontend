import userService, { type ForgotPasswordReq } from "@/api/services/userService";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/login-provider";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import EmailSentForm from "./email-sent-form";
import { Icon } from "@/components/icon";

function ForgotPasswordForm() {
	const { t } = useTranslation();
	const { loginState, setLoginState, backToLogin } = useLoginStateContext();
	const [sentEmail, setSentEmail] = useState<string>("");

	const forgotPasswordMutation = useMutation({
		mutationFn: userService.forgotPassword,
	});

	const form = useForm<ForgotPasswordReq>({
		defaultValues: {
			email: "",
		},
	});

	const onFinish = async (values: ForgotPasswordReq) => {
		try {
			await forgotPasswordMutation.mutateAsync(values);
			setSentEmail(values.email);
			setLoginState(LoginStateEnum.EMAIL_SENT);
		} catch (error) {
			// Error is handled by the API client interceptor
		}
	};

	// Show email sent confirmation page
	if (loginState === LoginStateEnum.EMAIL_SENT) {
		return <EmailSentForm email={sentEmail} />;
	}

	// Show forgot password form
	if (loginState !== LoginStateEnum.RESET_PASSWORD) return null;

	return (
		<>
			<div className="mb-8 text-center">
				<Icon icon="local:ic-reset-password" size="100" className="text-primary!" />
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFinish)} className="space-y-4">
					<div className="flex flex-col items-center gap-2 text-center">
						<h1 className="text-2xl font-bold">Forgot Password</h1>
						<p className="text-balance text-sm text-muted-foreground">
							Enter your email address and we'll send you a link to reset your password.
						</p>
					</div>

					<FormField
						control={form.control}
						name="email"
						rules={{ 
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address"
							}
						}}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input placeholder="Enter your email" type="email" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
						{forgotPasswordMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Sending...
							</>
						) : (
							"Send Reset Link"
						)}
					</Button>

					<div className="text-center">
						<ReturnButton onClick={backToLogin} />
					</div>
				</form>
			</Form>
		</>
	);
}

export default ForgotPasswordForm; 