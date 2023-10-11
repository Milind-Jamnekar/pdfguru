"use client";
import { trpc } from "@/app/_trpc/client";
import { Gem, Loader2, XIcon } from "lucide-react";
import Link from "next/link";
import ChatInput from "./ChatInput";
import Messages from "./Messages";
import { Button } from "./ui/button";

interface ChatWrapper {
  fileId: string;
}

const ChatWrapper = ({ fileId }: ChatWrapper) => {
  const { data, isLoading } = trpc.getFileStatusUpload.useQuery(
    { fileId },
    {
      refetchInterval: (data) =>
        data?.status === "SUCCESS" || data?.status === "FAILED" ? false : 500,
    }
  );

  if (isLoading) {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
            <h2 className="font-semibold text-xl">...Loading</h2>
            <p className="text-zinc-600 text-sm">
              We&apos;re preparing your pdf
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "PROCESSING") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 text-black animate-spin" />
            <h2 className="font-semibold text-xl">Processing...</h2>
            <p className="text-zinc-600 text-sm">This won&apos;t take a long</p>
          </div>
        </div>
      </div>
    );
  }

  if (data?.status === "FAILED") {
    return (
      <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-between gap-2">
        <div className="flex-1 flex justify-center items-center flex-col mb-28">
          <div className="flex flex-col items-center gap-2">
            <XIcon className="h-6 w-6 text-red-500 animate-spin" />
            <h2 className="font-semibold text-xl">Too many pdf pages</h2>
            <p className="text-zinc-600 text-sm">
              You&apos;re free allows 5 pages per PDF
            </p>
          </div>
        </div>

        <Link href="/pricing" className="mt-10">
          <Button variant="outline">
            <Gem className="h-6 w-6 text-orange-500 mx-1.5" />
            Upgrade to process more pages PDF.
          </Button>
        </Link>

        <ChatInput isDisabled />
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-zinc-50 flex divide-y divide-zinc-200 flex-col justify-content">
      <div className="flex-1 justify-between flex flex-col mb-28">
        <Messages />
      </div>
      <ChatInput />
    </div>
  );
};

export default ChatWrapper;
