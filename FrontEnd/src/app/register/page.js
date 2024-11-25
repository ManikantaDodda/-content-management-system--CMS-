"use client";

import InputComponent from "@/components/FormElements/InputComponent";
import SelectComponent from "@/components/FormElements/SelectComponent";
import Notification from "@/components/Notification";
import { registrationFormControls } from "@/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import axiosInstance from "@/utils/config";
const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "user",
};

export default function Register() {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  console.log(formData);

  function isFormValid() {
    return formData &&
      formData.name &&
      formData.role &&
      formData.name.trim() !== "" &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  }

  console.log(isFormValid());

  async function handleRegisterOnSubmit() {
    setLoading(true);;
    const res = await axiosInstance.post(`api/register`, formData);
    const data = res.data;
    console.log(data);
    if (res.status === 201) {
      toast.success(data.message, {
        position: "top-right",
      });
      setIsRegistered(true);
      setFormData(initialFormData);
    } else {
      toast.error(data.message, {
        position: "top-right",
      });
      //setFormData(initialFormData);
    }
    setLoading(false);
    console.log(data);
  }

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 mr-auto xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                {isRegistered
                  ? "Registration Successfull !"
                  : "Sign up for an account"}
              </p>
              {isRegistered ? (
                <button
                  className="inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide
                "
                onClick={()=>router.push('/login')}
                >
                  Login
                </button>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                {registrationFormControls.map((controlItem) =>
                  controlItem.componentType === "input" ? (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                      value={formData[controlItem.id]}
                    />
                  ) : controlItem.componentType === "select" ? (
                    <SelectComponent
                      key={controlItem.id}
                      options={controlItem.options}
                      label={controlItem.label}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                      value={formData[controlItem.id]}
                    />
                  ) : null
                )}

                  <button
                     className={`disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg 
                      text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide 
                      ${loading ? "cursor-not-allowed" : isFormValid() ? "hover:text-custom-blue" : ""}`}
                    disabled={!isFormValid() || loading}
                    onClick={handleRegisterOnSubmit}
                  > {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-3 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                  ) : (
                    "Register"
                  )}
                  </button>
                </div>
              )}
                 <div className="flex flex-col gap-2">
                   <p></p>
                   <p>Already have account? <span className="text-blue-600 hover:underline mr-2"><Link href={"/login"} >Login </Link></span> Here</p>
                 </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </div>
  );
}
