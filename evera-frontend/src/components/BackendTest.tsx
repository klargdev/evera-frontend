import { Button } from "@/ui/button";
import axios from "axios";
import { useState } from "react";

export function BackendTest() {
	const [status, setStatus] = useState<string>("");

	const testBackend = async () => {
		try {
			setStatus("Testing...");
			const response = await axios.get("http://localhost:5000/api/v1/health");
			setStatus(`Success: ${JSON.stringify(response.data)}`);
		} catch (error: any) {
			setStatus(`Error: ${error.message}`);
		}
	};

	return (
		<div className="p-4">
			<h2>Backend Connection Test</h2>
			<Button onClick={testBackend}>Test Backend</Button>
			<div className="mt-2">
				<strong>Status:</strong> {status}
			</div>
		</div>
	);
} 