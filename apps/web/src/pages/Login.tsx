import { useAuth } from "../auth/useAuth";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;
    try {
      await login({
        email: form.email.value,
        password: form.password.value,
      });
      toast.success("Login successful! Welcome back.");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <input name="email" placeholder="Email" className="input" />
      <input name="password" type="password" placeholder="Password" />
      <button>Login</button>
    </form>
  );
}
