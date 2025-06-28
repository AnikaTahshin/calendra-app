import PrivateNavbar from "@/components/PrivateNavbar";
import PublicNavbar from "@/components/PublicNavbar";
import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const MainLayout =async ({children}:{children:React.ReactNode}) => {

     const user = await currentUser()
  return (
  <main>
    {user ? <PrivateNavbar /> : <PublicNavbar />}
    <section className="pt-25">
{      children}
    </section>
  </main>);
};

export default MainLayout;
