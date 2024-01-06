import MessageContainer from "./components/MessageContainer";

interface IParams {
  conversationId: string;
}

const ConversationId = ({ params }: { params: IParams }) => {
  return (<MessageContainer conversationId={params.conversationId} />);
};

export default ConversationId;
