"use client";

import { trpc } from "@/app/_trpc/client";
import UploadButton from "./UploadButton";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { Button } from "./ui/button";
import { useState } from "react";

const Dashboard = () => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const utils = trpc.useContext();
  const { data: files, isLoading } = trpc.getUserFiles.useQuery();
  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setDeletingFile(id);
    },
    onSettled: () => setDeletingFile(null),
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div
        className="mt-8 mx-5 md:mx-10 flex flex-col items-start justify-between 
      gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0"
      >
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {files && files?.length !== 0 ? (
        <ul className="mt-8 mx-5 md:mx-10 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg
                 bg-white shadow transition hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
                    <div
                      className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r
                         from-cyan-500 to-blue-500"
                    ></div>
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-lg font-medium text-zinc-900">
                          {file.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    {new Date(file.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Mocked
                  </div>

                  <Button
                    onClick={() => deleteFile({ id: file.id })}
                    size="sm"
                    className="w-full hover:border hover:border-red-300"
                    variant="destructive"
                  >
                    {deletingFile ? (
                      <Loader2 className="h-4 w-4" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton count={5} className="mt-16" height={100} />
      ) : (
        <div className="flex flex-col items-center gap-2 mt-16">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">It&apos;s pretty empty here</h3>
          <p>let&apos; upload your pdf first </p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
