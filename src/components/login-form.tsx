import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/useAuth"; // Adjusted path
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    // In a real app, you would get username/password from the form
    // and send them to your backend for verification.
    // For now, we'll simulate a successful login.
    const mockUserData = { name: "Test User" };
    login(mockUserData);
    console.log(
      "Login successful, user:",
      mockUserData,
      "Navigating to home..."
    );
    navigate("/dashboard");
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      {...props}
      onSubmit={(e) => e.preventDefault()} // Prevent default form submission for now
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="button" className="w-full" onClick={handleLogin}>
          Login
        </Button>
        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center gap-2"
          onClick={() => {
            // Redireciona para o backend que inicia o fluxo OAuth do Google
            window.location.href = "http://localhost:3000/auth/google";
          }}
        >
          {/* Ícone simples do Google (multi-color G) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 533.5 544.3"
            className="h-4 w-4"
          >
            <path
              fill="#EA4335"
              d="M533.5 278.4c0-18.5-1.5-37-4.7-55H272v104h147.3c-6.4 34.8-26 64.3-55.5 84.1v69.8h89.4c52.4-48.2 80.3-119.3 80.3-202.9z"
            />
            <path
              fill="#34A853"
              d="M272 544.3c74.7 0 137.3-24.7 183.1-66.9l-89.4-69.8c-24.8 16.7-56.6 26.5-93.7 26.5-71.9 0-132.8-48.6-154.6-113.9H25.4v71.6c45.2 89.1 138 152.5 246.6 152.5z"
            />
            <path
              fill="#4A90E2"
              d="M117.4 320.2c-10.4-30.9-10.4-64 0-94.9V153.7H25.4c-34.9 69.5-34.9 152 0 221.5l92-55z"
            />
            <path
              fill="#FBBC05"
              d="M272 107.7c39.5-.6 77.2 14 105.9 40.8l79.1-79.1C409.3 24.3 346.7-.4 272 0 163.4 0 70.6 63.4 25.4 152.5l92 71.6C139.2 156.3 200.1 107.7 272 107.7z"
            />
          </svg>
          Entrar com Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  );
}
