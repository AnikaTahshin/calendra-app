import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const LoginPage = () => {
  return (
    <main className="flex flex-col items-center p-5 gap-10 animate-fade-in">
      <Image src="/assets/logo.svg" width={100} height={100} alt="logo" />

      <div>
        <SignIn />
      </div>
    </main>
  );
};

export default LoginPage;
