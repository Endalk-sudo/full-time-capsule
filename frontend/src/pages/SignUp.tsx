import React, { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { Eye, EyeOff } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const SignUp = () => {
  const signUp = useAuthStore((state) => state.register);
  const authError = useAuthStore((state) => state.authError);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formSchema = z
    .object({
      name: z.string(),
      email: z.email(),
      password: z.string().min(6, "password has to be at least 6 character"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "password does NOT match",
      path: ["confirmPassword"],
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    const { name, email, password, confirmPassword } = data;

    await signUp(name, email, password, confirmPassword);
  };

  return (
    <section className="flex h-screen items-center justify-center">
      <form
        className="flex w-md flex-col gap-4 rounded-2xl p-5 shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="mb-6 self-center text-3xl font-bold">Sign-Up</h1>

        {authError && (
          <div className="rounded-2xl border border-red-600 bg-[rgba(218,48,48,0.25)] p-3 text-center font-bold text-red-600">
            {authError}
          </div>
        )}

        <div>
          <label className="mb-5">Name: </label>
          <Input {...register("name")} placeholder="eg,.kebede" />
          {errors.name && (
            <p className="pt-2 text-xs font-medium text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <label className="mb-5">Email: </label>
          <Input {...register("email")} placeholder="eg,. kebede@gmail.com" />
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
              {...register("password")}
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
        <div>
          <label>Confirm Password: </label>
          <div className="relative">
            <Input
              {...register("confirmPassword")}
              type={showConfirmPassword ? "text" : "password"}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="pt-2 text-xs font-medium text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button className="transform cursor-pointer font-extrabold text-white transition-transform delay-75 duration-300 ease-in-out hover:-translate-y-1">
          Sign Up
        </Button>

        <p className="text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-bold underline">
            Log in
          </Link>
        </p>
      </form>
    </section>
  );
};

export default SignUp;
