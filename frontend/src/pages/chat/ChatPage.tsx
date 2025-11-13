import { ScrollArea } from "@/components/ui/scroll-area";
import Topbar from "../home/components/Topbar";
import ChatHeader from "./components/ChatHeader";
import UsersList from "./components/UsersList";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import MessageInput from "./components/MessageInput";
import NoConversationPlaceholder from "./components/NoConversationPlaceholder";
import { formatTimeFromString } from "@/lib/utils";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const ChatPage = () => {
  const { user, selectedUser, messages, getMessages } = useChatStore();

  useEffect(() => {
    if (selectedUser) getMessages(selectedUser?._id);
  }, [getMessages, selectedUser]);

  return (
    <main className="h-full rounded-lg bg-linear-to-b from-zinc-800 to-zinc-900 overflow-hidden">
      <Topbar />

      <div className="grid lg:grid-cols-[300px_1fr] grid-cols-[80px_1fr] h-[calc(100vh-180px)]">
        <UsersList />

        {/* chat message */}
        <div className="flex flex-col h-full">
          {selectedUser ? (
            <>
              <ChatHeader />

              {/* Messages */}
              <ScrollArea className="h-[calc(100vh-340px)]">
                <div className="p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message._id}
                      className={`flex items-start gap-3 ${
                        message.senderId === user?._id ? "flex-row-reverse" : ""
                      }`}
                    >
                      <Avatar className="size-8">
                        <AvatarImage
                          src={
                            message.senderId === user?._id
                              ? user.imageUrl
                              : selectedUser.imageUrl
                          }
                        />
                      </Avatar>

                      <div
                        className={`rounded-lg p-3 max-w-[70%]
													${message.senderId === user?._id ? "bg-green-500" : "bg-zinc-800"}
												`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <span className="text-xs text-zinc-300 mt-1 block">
                          {formatTimeFromString(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <MessageInput />
            </>
          ) : (
            <NoConversationPlaceholder />
          )}
        </div>
      </div>
    </main>
  );
};

export default ChatPage;
