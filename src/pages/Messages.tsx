
import { Layout } from "@/components/layout/Layout";
import { MessageList } from "@/components/messages/MessageList";
import { MessageChat } from "@/components/messages/MessageChat";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Messages() {
  const isMobile = useIsMobile();

  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)] w-full">
        <div className={cn(
          "border-r",
          isMobile ? "w-full" : "w-1/3"
        )}>
          <MessageList />
        </div>
        {!isMobile && (
          <div className="w-2/3">
            <MessageChat />
          </div>
        )}
      </div>
    </Layout>
  );
}
