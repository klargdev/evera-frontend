import userService, { type ResetPasswordReq } from "@/api/services/userService";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import { Loader2, Lock, Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

function ResetPasswordForm() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// Validate token when component loads
	const { data: tokenValidation, isLoading: isValidatingToken, isError: isTokenError, error: tokenError } = useQuery({
		queryKey: ['validateResetToken', token],
		queryFn: () => {
			if (!token) {
				// This should not happen if enabled is working, but as a safeguard
				return Promise.reject(new Error("No token found"));
			}
			return userService.validateResetToken(token)
		},
		enabled: !!token, // Only run if token exists
		retry: 1,
	});

	const resetPasswordMutation = useMutation({
		mutationFn: ({ token, data }: { token: string; data: ResetPasswordReq }) => userService.resetPassword(token, data),
	});

	const form = useForm<ResetPasswordReq>({
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const onFinish = async (values: ResetPasswordReq) => {
		try {
			await resetPasswordMutation.mutateAsync({ token: token!, data: values });
			toast.success("Password reset successfully! You can now log in with your new password.", {
				closeButton: true,
				duration: 5000,
			});
			// Wait a moment to show the success message before redirecting
			setTimeout(() => {
				navigate("/auth/login", { replace: true });
			}, 2000);
		} catch (error) {
			// Error is handled by the API client interceptor
		}
	};

	// 1. Show loading state while the token is being validated
	if (isValidatingToken) {
		return (
			<>
				<div className="mb-8 text-center">
					<Icon icon="local:ic-reset-password" size="100" className="text-primary!" />
				</div>
				<div className="flex flex-col items-center gap-4 text-center">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
					<h1 className="text-2xl font-bold">Validating Reset Link</h1>
					<p className="text-balance text-sm text-muted-foreground">
						Please wait while we verify your reset link...
					</p>
				</div>
			</>
		);
	}

	// 2. Show error state if token is missing, the query failed, or the backend returned an invalid status
	if (!token || isTokenError || !tokenValidation?.success) {
		return (
			<>
				<div className="mb-8 text-center">
					<Icon icon="local:ic-reset-password" size="100" className="text-primary!" />
				</div>
				<div className="flex flex-col items-center gap-4 text-center">
					<div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
						<Lock className="h-8 w-8 text-destructive" />
					</div>
					<h1 className="text-2xl font-bold">Invalid Reset Link</h1>
					<p className="text-balance text-sm text-muted-foreground">
						{ (tokenError as any)?.message || tokenValidation?.message || "The password reset link is invalid or has expired. Please request a new reset link."}
					</p>
					<Button onClick={() => navigate("/auth/login")}>
						Back to Login
					</Button>
				</div>
			</>
		);
	}

	// 3. If all checks pass, show the reset password form
	return (
		<>
			<div className="mb-8 text-center">
				<Icon icon="local:ic-reset-password" size="100" className="text-primary!" />
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onFinish)} className="space-y-4">
					<div className="flex flex-col items-center gap-2 text-center">
						<div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
							<Lock className="h-8 w-8 text-primary" />
						</div>
						<h1 className="text-2xl font-bold">Reset Password</h1>
						<p className="text-balance text-sm text-muted-foreground">
							Resetting password for: <strong>{tokenValidation?.email}</strong>
						</p>
					</div>

					<FormField
						control={form.control}
						name="password"
						rules={{ 
							required: "Password is required",
							minLength: {
								value: 8,
								message: "Password must be at least 8 characters"
							},
							pattern: {
								value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
								message: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
							}
						}}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="relative">
										<Input 
											placeholder="New password" 
											type={showPassword ? "text" : "password"} 
											{...field} 
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowPassword(!showPassword)}
										>
											{showPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="confirmPassword"
						rules={{
							required: "Please confirm your password",
							validate: (value) => value === form.getValues("password") || "Passwords do not match",
						}}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<div className="relative">
										<Input 
											placeholder="Confirm new password" 
											type={showConfirmPassword ? "text" : "password"} 
											{...field} 
										/>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
											onClick={() => setShowConfirmPassword(!showConfirmPassword)}
										>
											{showConfirmPassword ? (
												<EyeOff className="h-4 w-4" />
											) : (
												<Eye className="h-4 w-4" />
											)}
										</Button>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
						{resetPasswordMutation.isPending ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Resetting Password...
							</>
						) : (
							"Reset Password"
						)}
					</Button>

					<div className="text-center">
						<Button 
							type="button" 
							variant="ghost" 
							onClick={() => navigate("/auth/login")}
							className="text-sm"
						>
							Back to Login
						</Button>
					</div>
				</form>
			</Form>
		</>
	);
}

export default ResetPasswordForm; 