import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import AddCollegeButton from "../../../Components/Panel/Management/AddCollegeButton";
import AddCollegeForm from "../../../Components/Panel/Management/AddCollegeForm";
import CollegeRow from "../../../Components/Panel/Management/CollegeRow";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";

function Colleges() {
  const [openAdd, setOpenAdd] = useState(false);
  const [colleges, loading, axiosFetch]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/colleges?page=${pageNumber}&limit=20`,
    });
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  return (
    <>
      <div className="college-container">
        <AddCollegeButton openAdd={openAdd} setOpenAdd={setOpenAdd} />
        {openAdd && (
          <AddCollegeForm setOpenAdd={setOpenAdd} updateRows={setUpdate} />
        )}
        <h2>لیست دانشکده ها:</h2>
        <table>
          <thead>
            <tr>
              <th>نام دانشکده</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              colleges.result?.length &&
              colleges.result.map((college: any) => (
                <CollegeRow key={college.id} college={college} setUpdate={setUpdate} />
              ))}
          </tbody>
        </table>
      </div>
      {Math.ceil(colleges.totallItems / 20) !== 1 &&
        Math.ceil(colleges.totallItems / 20) !== 0 && (
        <div className="pagiMagi">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={4}
            pageCount={
              colleges.totallItems ? Math.ceil(colleges.totallItems / 20) : 0
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

export default Colleges;
