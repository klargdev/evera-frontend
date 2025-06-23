import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner";
import userService from "@/api/services/userService";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await userService.resetPassword(token, { password });
      toast.success("Password reset successful! You can now log in.");
      setTimeout(() => navigate("/auth/login"), 2000);
    } catch (err) {
      toast.error("Failed to reset password. The link may be invalid or expired.");
    }
  };

  if (!token) return <div>Invalid or missing token.</div>;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Reset Your Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
        className="w-full mb-3 p-2 border rounded"
      />
      <button type="submit" className="w-full bg-[#8B2F1C] text-white py-2 rounded font-semibold">Reset Password</button>
    </form>
  );
} 