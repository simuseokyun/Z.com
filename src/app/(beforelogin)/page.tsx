import { redirect } from "next/navigation";
import Main from "./_component/Main";
import { auth } from "@/auth";

export default async function Page() {
  const data = await auth();

  if (data?.user) {
    redirect("/home");
  }
  return <Main />;
}
