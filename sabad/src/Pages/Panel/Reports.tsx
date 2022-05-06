import "../../Styles/reports.scss"
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import ReportRow from "../../Components/Panel/Reports/ReportRow";
import LoadingModal from "../../Components/Modals/LoadingModal";

function Reports() {
  const [semesters, loading, axiosFetch]: any = useAxiosFunction();
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/semesters?page=${pageNumber}&limit=40&hasTestDates=false`,
    });
  }, [pageNumber]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  return (
    <>
      <div className="reports-container">
        <h2>لیست نیمسال ها:</h2>
        <table>
          <thead>
            <tr>
              <th>سال تحصیلی</th>
              <th>نیمسال</th>
              <th>تاریخ شروع</th>
              <th>تاریخ انتخاب واحد</th>
              <th>تاریخ حذف و اضافه</th>
              <th>برنامه</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              semesters.result?.length &&
              semesters.result.map((semester: any) => (
                <ReportRow key={semester.id} semester={semester} />
              ))}
          </tbody>
        </table>
      </div>
      {Math.ceil(semesters.totallItems / 40) !== 1 &&
        Math.ceil(semesters.totallItems / 40) !== 0 && (
          <div className="pagiMagi" style={{ direction: "rtl" }}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                semesters.totallItems
                  ? Math.ceil(semesters.totallItems / 40)
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

export default Reports;
