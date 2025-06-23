import { Button } from "@/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui/card";
import { useLogout } from "@/store/userStore";
import { useUserInfo } from "@/store/userStore";

export default function SimpleDashboard() {
	const { userInfo } = useUserInfo();
	const logout = useLogout();

	return (
		<div className="container mx-auto p-6">
			<div className="flex justify-between items-center mb-8">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<Button onClick={logout} variant="outline">
					Logout
				</Button>
			</div>

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle>Welcome!</CardTitle>
						<CardDescription>You have successfully logged in</CardDescription>
					</CardHeader>
					<CardContent>
						<p className="text-sm text-muted-foreground">
							Email: {userInfo.email || "Not available"}
						</p>
						<p className="text-sm text-muted-foreground">
							Name: {userInfo.firstName || userInfo.username || "Not available"}
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Authentication Status</CardTitle>
						<CardDescription>Your current session status</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex items-center space-x-2">
							<div className="w-2 h-2 bg-green-500 rounded-full"></div>
							<span className="text-sm">Authenticated</span>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Quick Actions</CardTitle>
						<CardDescription>Common actions you can take</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-2">
							<Button variant="outline" className="w-full" size="sm">
								View Profile
							</Button>
							<Button variant="outline" className="w-full" size="sm">
								Settings
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="mt-8">
				<Card>
					<CardHeader>
						<CardTitle>Debug Information</CardTitle>
						<CardDescription>Technical details for debugging</CardDescription>
					</CardHeader>
					<CardContent>
						<pre className="text-xs bg-muted p-4 rounded overflow-auto">
							{JSON.stringify(userInfo, null, 2)}
						</pre>
					</CardContent>
				</Card>
			</div>
		</div>
	);
} 