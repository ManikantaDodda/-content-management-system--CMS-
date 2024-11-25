"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import Notification from "@/components/Notification";
import { loginFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";

const initialFormData = {
  email: "",
  password: "",
};

export default function Login() {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function isValidForm() {
    return (
      formData.email.trim() !== "" && formData.password.trim() !== ""
    );
  }

  async function handleLogin() {
    if (!isValidForm()) return;

    setLoading(true); // Start loading

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}api/login`, formData);
      if (res.status === 200) {
        const token = res.data?.token;
        console.log(token)
        if (token) {
          localStorage.setItem("token", token);
          let decoded = jwtDecode(token);
          localStorage.setItem("session", JSON.stringify(decoded));
          toast.success("Login Successful", { position: "top-right" });
          setFormData(initialFormData);
          window.dispatchEvent(new Event("authChange"));
          router.push("/dashboard");
        }
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong. Check your email and password.", {
        position: "top-right",
      });
    } finally {
      setLoading(false); // End loading
    }
  }

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">Login</p>
              <div className="w-full mt-6 space-y-8">
                {loginFormControls.map((controlItem) =>
                  controlItem.componentType === "input" ? (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      value={formData[controlItem.id]}
                      onChange={(event) => {
                        setFormData((prev) => ({
                          ...prev,
                          [controlItem.id]: event.target.value,
                        }));
                      }}
                    />
                  ) : null
                )}

                <button
                  className={`inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                     ${loading ? "cursor-not-allowed" : isValidForm() ? "hover:text-custom-blue" : ""}`}
                  disabled={!isValidForm() || loading}
                  onClick={handleLogin}
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="flex flex-col gap-2">
                  <p>
                    Don&apos;t you have an account?{" "}
                    <span className="text-blue-600 hover:underline">
                      <Link href="/register"> Register </Link>
                    </span>
                    Here
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
