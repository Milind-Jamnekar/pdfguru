"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";

const UploadButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Upload pdf</Button>
      </DialogTrigger>
      <DialogContent>Example</DialogContent>
    </Dialog>
  );
};
export default UploadButton;
