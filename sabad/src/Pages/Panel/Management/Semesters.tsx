import { useState, useEffect } from "react";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import SemesterSubmit from "../../../Components/Modals/SemesterSubmit";
import SemesterRow from "../../../Components/Panel/Management/SemesterRow";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import ReactPaginate from "react-paginate";

function Semesters() {
  const [isOpen, setIsOpen] = useState(false);
  const [semesters, loading, axiosFetch]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/semesters?page=${pageNumber}&limit=20&hasTestDates=true`,
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
      {isOpen && (
        <SemesterSubmit setIsOpen={setIsOpen} updateRows={setUpdate} />
      )}
      <div className="semesters-container">
        <button onClick={handleClick}>+ افزودن نیمسال</button>
        <h2>لیست نیمسال ها:</h2>
        <table>
          <thead>
            <tr>
              <th>سال تحصیلی</th>
              <th>نیمسال</th>
              <th>تاریخ شروع</th>
              <th>تاریخ انتخاب واحد</th>
              <th>تاریخ حذف و اضافه</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && semesters.result?.length ? (
              semesters.result.map((semester: any) => (
                <SemesterRow
                  key={semester.id}
                  semester={semester}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="has-no-row">
                  نیمسالی برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(semesters.totallItems / 20) !== 1 &&
        Math.ceil(semesters.totallItems / 20) !== 0 && (
          <div className="pagiMagi">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                semesters.totallItems
                  ? Math.ceil(semesters.totallItems / 20)
                  : 0
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

export default Semesters;
