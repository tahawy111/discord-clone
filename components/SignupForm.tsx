"use client";
import { useCallback, useEffect, useState, useContext } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import axios from "axios";

interface AuthFormProps {}

export default function SignupForm({}: AuthFormProps) {
  const router = useRouter();
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials!");
        }

        if (callback?.ok) {
          router.push("/");
        }
      })
      .finally(() => setIsLoading(false));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    // Register

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Registerd has been done successfully");
      })
      .catch((error) => {
        toast.error(error);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="dark:bg-[#27282d] px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <Input
            placeholder="Name"
            type="text"
            id="name"
            {...register("name", { required: true })}
          />
          <Input
            className={`${errors["email"] && "focus:ring-red-500"}`}
            placeholder="Email"
            type="email"
            id="email"
            disabled={isLoading}
            {...register("email", { required: true })}
          />
          <Input
            className={`${errors["password"] && "focus:ring-red-500"}`}
            placeholder="Password"
            type="password"
            id="password"
            disabled={isLoading}
            {...register("password", { required: true })}
          />

          <div className="">
            <Button variant={"rose"} isLoading={isLoading} className="w-full">
              Register
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 items-center flex">
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center text-sm">
              <span className="dark:bg-[#27282d] bg-white px-2 text-gray-500 dark:text-white">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              className="dark:bg-main dark:border-none dark:outline-none dark:hover:bg-[#383941]"
              onClick={() => socialAction("google")}
            >
              {/* Google */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={16}
                height={16}
                fill="currentColor"
                className=""
                viewBox="0 0 16 16"
              >
                <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z" />
              </svg>
            </AuthSocialButton>
          </div>
        </div>

        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500 dark:text-white">
          Already Have An Account?
          <div className="underline cursor-pointer">
            <Link href={"/login"}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
