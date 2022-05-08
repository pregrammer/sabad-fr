import "../../../Styles/schedules.scss";
import { useState, useEffect } from "react";
import ScheduleRow from "../../../Components/Panel/Schedule/ScheduleRow";
import ReactPaginate from "react-paginate";
import ScheduleSubmit from "../../../Components/Modals/ScheduleSubmit";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { useAuth } from "../../../Components/Contexts/AuthProvider";

function Schedules() {
  const [editOpen, setEditOpen] = useState(false);
  const [testDates, tsetDatesLoading, axiosFetch2]: any = useAxiosFunction();
  const [schedules, loading, axiosFetch]: any = useAxiosFunction();
  const [pageNumber, setPageNumber] = useState(1);
  const [update, setUpdate] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: `/semesters/last-test-dates`,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/schedules?page=${pageNumber}&limit=20`,
    });
    // eslint-disable-next-line
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  return (
    <>
      {editOpen && (
        <ScheduleSubmit setEditOpen={setEditOpen} updateRows={setUpdate} />
      )}
      <div className="schedules">
        {auth.role === 2 && (
          <button onClick={() => setEditOpen((prev: boolean) => !prev)}>
            + افزودن درس به برنامه
          </button>
        )}
        <h3 style={auth.role === 3 ? { marginTop: "50px" } : {}}>
          لیست دروس برنامه ریزی شده
        </h3>
        {!loading && schedules.result?.length ? (
          schedules.result.map((schedule: any) => (
            <ScheduleRow
              key={schedule.id}
              schedule={schedule}
              setUpdate={setUpdate}
              testDates={testDates}
            />
          ))
        ) : (
          <div className="has-no-content">
            درس برنامه ریزی شده ای برای نمایش وجود ندارد
          </div>
        )}
      </div>
      {Math.ceil(schedules.totallItems / 20) !== 1 &&
        Math.ceil(schedules.totallItems / 20) !== 0 && (
          <div className="pagiMagi" style={{ direction: "rtl" }}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                schedules.totallItems
                  ? Math.ceil(schedules.totallItems / 20)
                  : 0
              }
              previousLabel="<"
              renderOnZeroPageCount={() => null}
            />
          </div>
        )}
      {(loading || tsetDatesLoading) && <LoadingModal />}
    </>
  );
}

export default Schedules;
