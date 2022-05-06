import Message from "../../../Components/Panel/Messages/Message";
import { useState, useEffect } from "react";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import { useMsgCount } from "../../../Components/Contexts/MsgCountProvider";
import ReactPaginate from "react-paginate";

function Inbox() {
  const [messages, loading, axiosFetch]: any = useAxiosFunction();
  const { count, setRefreshCount } = useMsgCount();
  const [pageNumber, setPageNumber] = useState(1);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/messages/others?page=${pageNumber}&limit=20`,
    });

    return () => {
      if (count !== 0) {
        setRefreshCount((prev: any) => !prev);
      }
    };
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  return (
    <>
      <div className="inbox-container">
        {!loading &&
          messages.result?.length &&
          messages.result.map((message: any) => (
            <Message key={message.id} message={message} isInbox={true} setUpdate={setUpdate} />
          ))}
      </div>
      {Math.ceil(messages.totallItems / 20) !== 1 &&
        Math.ceil(messages.totallItems / 20) !== 0 && (
        <div className="pagiMagi">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={4}
            pageCount={
              messages.totallItems ? Math.ceil(messages.totallItems / 20) : 0
            }
            previousLabel="<"
            renderOnZeroPageCount={() => null}
          />
        </div>
      )}
      {loading && <LoadingModal />}
    </>
  );
}

export default Inbox;
