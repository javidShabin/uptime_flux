import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../auth/useAuth";
import { Link, Navigate, useNavigate } from "react-router-dom";

type RegisterFormValues = {
  email: string;
  password: string;
};

export default function Register() {
  const { register: signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  async function onSubmit(data: RegisterFormValues) {
    try {
      await signup(data);
      toast.success("Account created successfully 🎉");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-neutral-950 px-4 py-12">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Create your UptimeFlux account
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Start monitoring your services in minutes
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm text-white/70 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              {...register("email", {
                required: "Email is required",
              })}
              className="
                w-full rounded-lg border border-white/10
                bg-neutral-900 px-4 py-3 text-white
                placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-red-500/50
              "
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white/70 mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a strong password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="
                w-full rounded-lg border border-white/10
                bg-neutral-900 px-4 py-3 text-white
                placeholder-white/40
                focus:outline-none focus:ring-2 focus:ring-red-500/50
              "
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="
              w-full rounded-lg bg-red-600 py-3 font-medium text-white
              hover:bg-red-500 transition
              disabled:opacity-60 disabled:cursor-not-allowed
              shadow-[0_0_30px_rgba(239,68,68,0.45)]
            "
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-white/60">
          Already have an account? <Link to={"/login"} className="text-red-500">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
