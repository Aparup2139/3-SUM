// import { Send } from "lucide-react";
// import {
//     ChatBubble,
//     ChatBubbleAvatar,
//     ChatBubbleMessage,
// } from "@/components/ui/chat/chat-bubble";

// import { ChatMessageList } from "@/components/ui/chat/chat-message-list";;
// import { Button } from "@/components/ui/button";
import { PageWrapper } from "@/components/pagesWrapper/pagesWrapper"
// import { Input } from "@/components/ui/input";

export const MessagesPage = () => {
    return (<PageWrapper
        headerText="Messages"
        leftContent={<LeftContent />}
        rightContent={<RightContent />}
    />)
}

const LeftContent = () => {
    return <div className="h-full w-full flex flex-col relative items-center justify-start" >
        {/* <div className="h-[90%] w-full p-1">
            <ChatMessageList >
                <ChatBubble variant='sent'>
                    <ChatBubbleAvatar fallback='US' />
                    <ChatBubbleMessage variant='sent'>
                        Hello, how has your day been? I hope you are doing well.
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>
                    <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage variant='received'>
                        Hi, I am doing well, thank you for asking. How can I help you today?
                    </ChatBubbleMessage>
                </ChatBubble>

                <ChatBubble variant='received'>
                    <ChatBubbleAvatar fallback='AI' />
                    <ChatBubbleMessage isLoading />
                </ChatBubble>
            </ChatMessageList>
        </div>
        <div className="flex gap-1 w-full p-4 h-[10%] justify-center items-center">
            <Input placeholder="Type your message.." >
            </Input >
            <Button>
                <Send />
            </Button>
        </div> */}
        <h1>Not Implmented</h1>
    </div>
}

const RightContent = () => {
    return <div className="h-full w-full " >lore</div>
}