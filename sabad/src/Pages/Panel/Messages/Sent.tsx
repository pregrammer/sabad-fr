import Message from "../../../Components/Panel/Messages/Message";
import { useEffect } from "react";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../../Components/Modals/LoadingModal";

function Sent() {
  const [messages, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: "/messages/sent?page=1&limit=10",
    });
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="sent-container">
        {!loading &&
          messages.result?.length &&
          messages.result.map((message: any) => (
            <Message key={message.id} message={message} />
          ))}
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default Sent;
