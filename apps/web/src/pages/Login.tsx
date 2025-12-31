import { useAuth } from "../auth/useAuth";

export default function Login() {
  const { login } = useAuth();

  async function handleSubmit(e: any) {
    e.preventDefault();
    const form = e.target;
    await login({
      email: form.email.value,
      password: form.password.value,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 max-w-md mx-auto">
      <input name="email" placeholder="Email" className="input" />
      <input name="password" type="password" placeholder="Password" />
      <button>Login</button>
    </form>
  );
}
