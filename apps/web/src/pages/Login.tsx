import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Chrome } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>()

  const validateForm = (data: LoginFormData) => {
    try {
      loginSchema.parse(data)
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            setError(issue.path[0] as keyof LoginFormData, {
              type: 'manual',
              message: issue.message,
            })
          }
        })
      }
      return false
    }
  }

  const onSubmit = async (data: LoginFormData) => {
    if (!validateForm(data)) {
      return
    }
    // Dummy submit - no API integration
    console.log('Login data:', data)
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleGoogleAuth = () => {
    // Dummy Google auth
    console.log('Google authentication clicked')
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <Card className="relative w-full max-w-md bg-slate-900/50 backdrop-blur-sm border-slate-800/50 shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold text-slate-100">Welcome back</CardTitle>
          <CardDescription className="text-slate-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            type="button"
            variant="outline"
            className="w-full border-slate-700/50 bg-slate-800/30 text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
            onClick={handleGoogleAuth}
          >
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900/50 px-2 text-slate-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus:border-sky-500/50"
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-400">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

