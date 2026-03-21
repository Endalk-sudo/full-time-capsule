import React, { useState } from "react";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Eye, EyeOff } from "lucide-react";

type FormValures = {
  email: string;
  password: string;
};

const Login = () => {
  const login = useAuthStore((state) => state.login);
  const authError = useAuthStore((state) => state.authError);
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    email: z.email(),
    password: z
      .string("password is required")
      .min(6, "password has to be at least 6 chatacter"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValures>({ resolver: zodResolver(formSchema) });

  const onSubmit = async (data: FormValures) => {
    const { email, password } = data;

    console.log("email :", email);
    console.log("password : ", password);

    await login(email, password);
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <form
        className="flex w-md flex-col gap-4 rounded-2xl p-5 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 self-center text-3xl font-bold">Login</h1>

        {authError && (
          <div className="rounded-2xl border border-red-600 bg-[rgba(218,48,48,0.25)] p-3 text-center font-bold text-red-600">
            {authError}
          </div>
        )}

        <div>
          <label className="mb-5">Email: </label>
          <Input
            {...register("email", { required: "email is required" })}
            placeholder="eg,. kebede@gmail.com"
          />
          {errors.email && (
            <p className="pt-2 text-xs font-medium text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <label>Password: </label>
          <div className="relative">
            <Input
              {...register("password", { required: "password is required" })}
              type={showPassword ? "text" : "password"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="pt-2 text-xs font-medium text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button className="transform cursor-pointer font-extrabold text-white transition-transform delay-75 duration-300 ease-in-out hover:-translate-y-1">
          Login
        </Button>
        <p className="text-center">
          New here?{" "}
          <Link to="/sign_up" className="font-bold underline">
            Create an account
          </Link>
        </p>
      </form>
    </section>
  );
};

export default Login;
