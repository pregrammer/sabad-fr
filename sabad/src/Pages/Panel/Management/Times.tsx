import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import TimeSubmit from "../../../Components/Modals/TimeSubmit";
import TimeRow from "../../../Components/Panel/Management/TimeRow";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";

function Times() {
  const [isOpen, setIsOpen] = useState(false);
  const [times, loading, axiosFetch]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/times?page=${pageNumber}&limit=20`,
    });
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  function handleClick() {
    setIsOpen((prev: boolean) => !prev);
  }

  return (
    <>
    {isOpen && <TimeSubmit setIsOpen={setIsOpen} updateRows={setUpdate} />}
      <div className="times-container">
        <button onClick={handleClick}>+ افزودن ساعت</button>
        <h2>لیست ساعات درسی:</h2>
        <table>
          <thead>
            <tr>
              <th>از ساعت</th>
              <th>تا ساعت</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              times.result?.length &&
              times.result.map((time: any) => (
                <TimeRow key={time.id} time={time} setUpdate={setUpdate} />
              ))}
          </tbody>
        </table>
      </div>
      {Math.ceil(times.totallItems / 20) !== 1 && (
        <div className="pagiMagi">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={4}
            pageCount={
              times.totallItems ? Math.ceil(times.totallItems / 20) : 0
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

export default Times;
