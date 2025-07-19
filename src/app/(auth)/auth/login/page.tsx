'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/');
    }
  };

  const handleSocialLogin = (provider: 'google' | 'github') => {
    signIn(provider, { callbackUrl: 'http://localhost:3000' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#dbeafe] via-[#bfdbfe] to-[#93c5fd] px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#14326E]">CampusBridge</h1>
          <p className="text-gray-600 text-sm mt-2">
            Unlock your future — connect, learn, and grow together.
          </p>
        </div>

        {/* <h2 className="text-xl font-semibold text-center text-[#14326E] mb-4">Welcome Back 👋</h2> */}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8E8]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
        <div className="relative mt-1">
            <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00A8E8] pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            />
            <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
            >
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
        </div>
            </div>


          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#3b82f6] hover:bg-[#14326E] transition-all duration-200 text-white font-semibold py-2 rounded-lg shadow-sm"
          >
            Login
          </button>
        </form>

        <div className="my-6 border-t text-center text-sm text-gray-500 relative">
          <span className="bg-white px-2 absolute -top-3 left-1/2 transform -translate-x-1/2">or continue with</span>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSocialLogin('google')}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 py-2 rounded-lg transition"
          >
            <FcGoogle size={20} />
            <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
          </button>

          <button
            onClick={() => handleSocialLogin('github')}
            className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-100 py-2 rounded-lg transition"
          >
            <FaGithub size={20} />
            <span className="text-sm font-medium text-gray-700">Sign in with GitHub</span>
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-[#14326E] hover:underline font-bold py-2 ">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
