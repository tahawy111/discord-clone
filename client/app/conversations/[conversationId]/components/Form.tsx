"use client";
import useConversation from "@/app/hooks/useCoversation";
import axios from "axios";
import { Image } from "lucide-react";
import { useContext } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import MessageInput from "./MessageInput";
import Icons from "@/app/components/Icons";
import { CldUploadButton } from "next-cloudinary";
import { SocketContext } from "@/app/context/SocketContext";
import { useSession } from "next-auth/react";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";

interface FormProps {
  conversation: Conversation & {
    users: User[];
  };
}

export default function Form({ conversation }: FormProps) {
  const { conversationId } = useConversation();
  const { socket, setMessages } = useContext(SocketContext);
  const session = useSession();
  const otherUser = useOtherUser(conversation);
  console.log(conversation);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setValue("message", "", { shouldValidate: true });
    axios
      .post("/api/messages", {
        ...data,
        conversationId,
      })
      .then(({ data }) => {
        setMessages((current) => [...current, data]);

        if (conversation.userIds.length > 2) {
          conversation.userIds
            // Get the other users
            .filter((userId) => userId !== session.data?.user.id)
            .forEach((userId) => {
              socket?.emit("sendMessage", {
                message: data,
                receiverId: userId,
              });
            });
        } else {
          socket?.emit("sendMessage", {
            message: data,
            receiverId: otherUser.id,
          });
        }
      });
  };

  const handleUpload = (result: any) => {
    axios.post("/api/messages", {
      conversationId,
      image: result?.info?.secure_url,
    }).then(({data}) => {

      setMessages((current) => [...current, data]);
      

      if (conversation.userIds.length > 2) {
        conversation.userIds
          // Get the other users
          .filter((userId) => userId !== session.data?.user.id)
          .forEach((userId) => {
            socket?.emit("sendMessage", {
              message: data,
              receiverId: userId,
            });
          });
      } else {
        socket?.emit("sendMessage", {
          message: data,
          receiverId: otherUser.id,
        });
      }

    })

  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{
          maxFiles: 1,
        }}
        onUpload={handleUpload}
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      >
        <Image className="text-sky-500" />
      </CldUploadButton>
      <form
        className="flex items-center gap-2 lg:gap-4 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <MessageInput
          id="message"
          register={register}
          errors={errors}
          required
          placeholder="Write a message"
        />
        <button className="rounded-full p-2 bg-sky-500 cursor-pointer hover:bg-sky-600 transition text-white">
          <Icons.paperAirPlane className="fill-white w-6 h-6 translate-x-[1px]" />
        </button>
      </form>
    </div>
  );
}
