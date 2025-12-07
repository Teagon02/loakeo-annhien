import React from "react";
import { SignInButton } from "@clerk/nextjs";

const SignIn = () => {
  return (
    <SignInButton mode="modal">
      <button className="text-sm font-semibold hover:text-lightColor hover:cursor-pointer hoverEffect">
        Đăng nhập
      </button>
    </SignInButton>
  );
};

export default SignIn;
