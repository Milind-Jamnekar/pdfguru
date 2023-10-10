"use client";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useToast } from "./ui/use-toast";
import { useResizeDetector } from "react-resize-detector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface PdfRendererProps {
  file: string;
}

const PdfRenderer = ({ file }: PdfRendererProps) => {
  const { toast } = useToast();
  const [pages, setPages] = useState<undefined | number>();
  const [currPage, setCurrPage] = useState(1);

  const customPageValidatorSchema = z.object({
    page: z.string().refine((num) => Number(num) > 0 && Number(num) <= pages!),
  });
  type CustomPageValidatorType = z.infer<typeof customPageValidatorSchema>;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CustomPageValidatorType>({
    defaultValues: {
      page: "1",
    },
    resolver: zodResolver(customPageValidatorSchema),
  });

  const { width, ref } = useResizeDetector();

  const handlePageSubmit = ({ page }: CustomPageValidatorType) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  return (
    <div className="w-full bg-white rounded-md shadow-lg flex flex-col items-center">
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Button
            disabled={currPage <= 1}
            onClick={() => setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1))}
            variant="ghost"
            aria-label="previous page"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1.5">
            <Input
              {...register("page")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit(handlePageSubmit);
                }
              }}
              className={cn(
                "w-12 h-8",
                errors.page && "focus-visible:ring-red-500"
              )}
            />
            <p className="text-zinc-700 text-sm space-x-1">
              <span>/</span>
              <span>{pages ?? "x"}</span>
            </p>
          </div>

          <Button
            disabled={pages === undefined || currPage === pages}
            onClick={() =>
              setCurrPage((prev) => (prev + 1 > pages! ? pages! : prev + 1))
            }
            variant="ghost"
            aria-label="next page"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-h-screen">
        <div ref={ref}>
          <Document
            loading={
              <div className="flex justify-center">
                <Loader2 className="my-24 animate-spin h-4 w-4" />
              </div>
            }
            onLoadError={() =>
              toast({
                title: "Erron loading pdf",
                description: "Please try again later",
                variant: "destructive",
              })
            }
            onLoadSuccess={({ numPages }) => setPages(numPages)}
            file={file}
            className="max-h-full"
          >
            <Page width={width ? width : 1} pageNumber={currPage} />
          </Document>
        </div>
      </div>
    </div>
  );
};
export default PdfRenderer;
