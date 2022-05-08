import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import AddFosButton from "../../../Components/Panel/Management/AddFosButton";
import AddFosForm from "../../../Components/Panel/Management/AddFosForm";
import FosRow from "../../../Components/Panel/Management/FosRow";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";

function FieldOfStudies() {
  const [openAdd, setOpenAdd] = useState(false);
  const [field_of_studies, loading, axiosFetch]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/field_of_studies?page=${pageNumber}&limit=20`,
    });
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  return (
    <>
      <div className="fos-container">
        <AddFosButton openAdd={openAdd} setOpenAdd={setOpenAdd} />
        {openAdd && (
          <AddFosForm setOpenAdd={setOpenAdd} updateRows={setUpdate} />
        )}
        <h2>لیست رشته ها:</h2>
        <table>
          <thead>
            <tr>
              <th>رشته ی تحصیلی</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && field_of_studies.result?.length ? (
              field_of_studies.result.map((field_of_study: any) => (
                <FosRow
                  key={field_of_study.id}
                  field_of_study={field_of_study}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={2} className="has-no-row">
                  رشته ای برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(field_of_studies.totallItems / 20) !== 1 &&
        Math.ceil(field_of_studies.totallItems / 20) !== 0 && (
          <div className="pagiMagi">
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                field_of_studies.totallItems
                  ? Math.ceil(field_of_studies.totallItems / 20)
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

export default FieldOfStudies;
