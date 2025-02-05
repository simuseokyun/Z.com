"use client";
import Main from "../_component/Main";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/i/flow/login");
  }, []);

  return <Main />;
}
