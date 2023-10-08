"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../_trpc/client";
import { Loader2 } from "lucide-react";

const AuthCallbackPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const origin = searchParams.get("origin");
  const data = trpc.authCallback.useQuery(undefined, {
    onSuccess: ({ success }) => {
      if (success) {
        //user is synched in db
        router.push(origin ? `${origin}` : "/dashboard");
      }
    },
    onError: (err) => {
      if (err.data?.code === "UNAUTHORIZED") router.push("/sign-in");
    },
    retry: true,
    retryDelay: 500,
  });

  return (
    <div className="w-full mt-24 flex justify-center">
      <div className="flex flex-col items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin text-zinc-800" />
        <h3 className="font-semibold text-xl">Setting you account...</h3>
        <p>you will be redirected automatically...</p>
      </div>
    </div>
  );
};

export default AuthCallbackPage;
