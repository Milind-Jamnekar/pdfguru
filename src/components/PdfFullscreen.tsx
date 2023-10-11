import { Expand, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { cn } from "@/lib/utils";
import { Page, Document } from "react-pdf";
import SimpleBar from "simplebar-react";
import { useResizeDetector } from "react-resize-detector";
import { useState } from "react";

interface PdfFullscreen {
  fileUrl: string;
}

const PdfFullscreen = ({ fileUrl }: PdfFullscreen) => {
  const { width, ref } = useResizeDetector();
  const [numPages, setNumPages] = useState<number>();

  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="ghost" className="gap-1.5" aria-label="full screen">
          <Expand className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl w-full">
        <SimpleBar
          autoHide={false}
          className="max-h-[calc(100vh-10rem)] border-2 border-zinc-200 "
        >
          <div ref={ref}>
            <Document
              loading={
                <div className="flex justify-center">
                  <Loader2 className="my-24 h-6 w-6 animate-spin" />
                </div>
              }
              file={fileUrl}
              className="max-h-full"
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
            >
              {new Array(numPages).fill(0).map((_, i) => (
                <Page
                  key={i}
                  pageNumber={i + 1}
                  width={width ? width : 1}
                  loading={
                    <div className="flex justify-center">
                      <Loader2 className="my-24 h-6 w-6 animate-spin" />
                    </div>
                  }
                />
              ))}
            </Document>
          </div>
        </SimpleBar>
      </DialogContent>
    </Dialog>
  );
};

export default PdfFullscreen;
