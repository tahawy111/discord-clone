import LoginForm from "@/components/LoginForm";
import {} from "react";

interface LoginPageProps {}

export default function LoginPage({}: LoginPageProps) {
  return (
    <div className="flex items-center h-full">
      <LoginForm />
    </div>
  );
}
