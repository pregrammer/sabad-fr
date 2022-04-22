import Message from "../../../Components/Panel/Messages/Message";
import { useEffect } from "react";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import { useMsgCount } from "../../../Components/Contexts/MsgCountProvider";

function Inbox() {
  const [messages, loading, axiosFetch]: any = useAxiosFunction();
  const { count, setRefreshCount } = useMsgCount();

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: "/messages/others?page=1&limit=10",
    });

    return () => {
      if (count !== 0) {
        setRefreshCount((prev: any) => !prev);
      }
    };
  }, []);

  return (
    <>
      <div className="inbox-container">
        {!loading &&
          messages.result?.length &&
          messages.result.map((message: any) => (
            <Message key={message.id} message={message} isInbox={true} />
          ))}
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default Inbox;
