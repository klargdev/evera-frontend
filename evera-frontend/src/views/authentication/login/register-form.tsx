import React from "react";
import userService from "@/api/services/userService";
import { Button } from "@/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/ui/form";
import { Input } from "@/ui/input";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/login-provider";
import { toast } from "sonner";

function RegisterForm({ plan = "" }) {
	const { t } = useTranslation();
	const { loginState, backToLogin } = useLoginStateContext();

	const signUpMutation = useMutation({
		mutationFn: userService.signup,
	});

	const form = useForm({
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
			plan: plan,
		},
	});

	React.useEffect(() => {
		form.setValue("plan", plan);
	}, [plan]);

	const onFinish = async (values: any) => {
		try {
			await signUpMutation.mutateAsync(values);
			toast.success("Account created! Please check your email to verify your account before logging in.", {
				position: "top-center",
				duration: 5000,
			});
			setTimeout(() => {
				backToLogin();
			}, 2000);
		} catch (error) {
			// Show user-friendly error message
			let message = "Something went wrong. Please try again.";
			if (error?.message && !error.message.includes('Cannot read') && !error.message.includes('undefined')) {
				message = error.message;
			}
			toast.error(message, {
				position: "top-center",
			});
		}
	};

	if (loginState !== LoginStateEnum.REGISTER) return null;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onFinish)} className="space-y-4">
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">{t("sys.login.signUpFormTitle")}</h1>
					{plan && (
						<div className="mt-2 text-base font-semibold text-[#8B2F1C]">Selected Plan: {plan.charAt(0).toUpperCase() + plan.slice(1)}</div>
					)}
				</div>

				<FormField
					control={form.control}
					name="firstName"
					rules={{ required: "First name is required" }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="First Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="lastName"
					rules={{ required: "Last name is required" }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder="Last Name" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="email"
					rules={{ required: t("sys.login.emaildPlaceholder") }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input placeholder={t("sys.login.email")} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="password"
					rules={{ required: t("sys.login.passwordPlaceholder") }}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder={t("sys.login.password")} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="confirmPassword"
					rules={{
						required: t("sys.login.confirmPasswordPlaceholder"),
						validate: (value) => value === form.getValues("password") || t("sys.login.diffPwd"),
					}}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<Input type="password" placeholder={t("sys.login.confirmPassword")} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="plan"
					render={({ field }) => <input type="hidden" {...field} />}
				/>

				<Button type="submit" className="w-full">
					{t("sys.login.registerButton")}
				</Button>

				<div className="mb-2 text-xs text-gray">
					<span>{t("sys.login.registerAndAgree")}</span>
					<a href="./" className="text-sm underline! text-primary!">
						{t("sys.login.termsOfService")}
					</a>
					{" & "}
					<a href="./" className="text-sm underline! text-primary!">
						{t("sys.login.privacyPolicy")}
					</a>
				</div>

				<ReturnButton onClick={backToLogin} />
			</form>
		</Form>
	);
}

export default RegisterForm;
