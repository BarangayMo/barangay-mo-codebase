
import { Layout } from "@/components/layout/Layout";
import { MessageList } from "@/components/messages/MessageList";
import { MessageChat } from "@/components/messages/MessageChat";

export default function Messages() {
  return (
    <Layout>
      <div className="flex h-[calc(100vh-80px)]">
        <MessageList />
        <MessageChat />
      </div>
    </Layout>
  );
}
