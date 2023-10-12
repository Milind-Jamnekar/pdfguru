import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, ReactNode, createContext, useState } from "react";

type StreamResponse = {
  message: string;
  isLoading: boolean;
  addMessage: () => void;
  handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

export const ChatContext = createContext<StreamResponse>({
  message: "",
  isLoading: false,
  addMessage: () => {},
  handleInputChange: () => {},
});

type Props = {
  fileId: string;
  children: ReactNode;
};

export const ChatContextProvider = ({ fileId, children }: Props) => {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch("/api/message", {
        method: "POST",
        body: JSON.stringify({
          fileId,
          message,
        }),
      });

      if (!response.ok) {
        throw new Error("error from response");
      }

      return response.body;
    },
  });

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const addMessage = () => sendMessage({ message });

  return (
    <ChatContext.Provider
      value={{
        addMessage,
        message,
        handleInputChange,
        isLoading,
      }}
    ></ChatContext.Provider>
  );
};
