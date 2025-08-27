// import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/Login/login-form"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          src="/images/mentis-abstract.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-col gap-2 p-6 md:p-10">
        <div className="flex justify-center">
            <div className="flex h-32 w-32 items-end justify-center">
              {/* <GalleryVerticalEnd className="size-4" /> */}
              <img src="/images/teste.png" alt="Img" />
            </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
