"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CldUploadButton } from "next-cloudinary";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import FileUpload from "@/components/file-upload";
import { imageUpload } from "@/lib/ImageUpload";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "Server name is required." }),
  image: z.string().min(1, { message: "Server image is required." }),
});

const InitialModal = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);
  const [file, setFile] = useState<File>();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      image: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    try {
      const imgRes = await imageUpload(file as File, {
        CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
        CLOUDINARY_UPLOAD_PRESET:
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      });

      await axios.post("/api/servers", {
        name: values.name,
        imageUrl: imgRes.url,
        cldPublicId: imgRes.public_id,
      });

      form.reset();
      router.refresh();
      window.location.reload();
    } catch (error) {}
  };

  if (!isMounted) return null;

  // const handleUpload = (result: any) => {
  //   axios.post("/api/messages", {
  //     conversationId,
  //     image: result?.info?.secure_url,
  //   }).then(({data}) => {

  //     setMessages((current) => [...current, data]);

  //     if (conversation.userIds.length > 2) {
  //       conversation.userIds
  //         // Get the other users
  //         .filter((userId) => userId !== session.data?.user.id)
  //         .forEach((userId) => {
  //           socket?.emit("sendMessage", {
  //             message: data,
  //             receiverId: userId,
  //           });
  //         });
  //     } else {
  //       socket?.emit("sendMessage", {
  //         message: data,
  //         receiverId: otherUser.id,
  //       });
  //     }

  //   })

  // };
  return (
    <div>
      <Dialog open>
        <DialogContent className="bg-white text-black p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Customize your server
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-500">
              Give your server a personality with a name and an image. you can
              always change it later.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-8 px-6">
                <div className="flex text-center items-center justify-center">
                  <FormField
                    control={form.control}
                    name="image"
                    render={() => (
                      <FormItem>
                        <FormControl>
                          <FileUpload
                            endpoint="serverImage"
                            file={file}
                            setFile={setFile}
                            setValue={form.setValue}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                        Sever Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter server name"
                          disabled={isLoading}
                          className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter className="bg-gray-100 px-6 py-4">
                <Button isLoading={isLoading} variant={"primary"} disabled={isLoading}>
                  Create
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InitialModal;
