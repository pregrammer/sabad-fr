import "../../Styles/professors.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import ProfessorRow from "../../Components/Panel/Professors/ProfessorRow";
import { useState, useEffect } from "react";
import ProfessorSubmit from "../../Components/Modals/ProfessorSubmit";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useAuth } from "../../Components/Contexts/AuthProvider";
import LoadingModal from "../../Components/Modals/LoadingModal";
import ReactPaginate from "react-paginate";

function Professors() {
  const [editOpen, setEditOpen] = useState(false);
  const [fosList, fosLoading, axiosFetch2]: any = useAxiosFunction();
  const [professors, loading, axiosFetch]: any = useAxiosFunction();
  const [pageNumber, setPageNumber] = useState(1);
  const [update, setUpdate] = useState(false);
  const { auth } = useAuth();
  const [filters, setFilters] = useState({
    fos: auth.field_of_study_id ? auth.field_of_study_id : "all",
    kind: "all",
    grade: "all",
  });

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: `/field_of_studies?forSelect=true`,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/professors?page=${pageNumber}&limit=40&field_of_study_id=${filters.fos}&isInvited=${filters.kind}&lastGrade=${filters.grade}`,
    });
    // eslint-disable-next-line
  }, [pageNumber, update]);

  const handlePageClick = (e: any) => {
    const nextPage = e.selected + 1;
    setPageNumber(nextPage);
  };

  function handleProfSubmit() {
    setEditOpen((prev: boolean) => !prev);
  }

  function handleFilterClick() {
    setUpdate((prev: boolean) => !prev);
  }

  function handleFilterChange(e: any) {
    switch (e.target.name) {
      case "fos":
        setFilters((prev: any) => ({ ...prev, fos: e.target.value }));
        break;
      case "kind":
        setFilters((prev: any) => ({ ...prev, kind: e.target.value }));
        break;
      case "grade":
        setFilters((prev: any) => ({ ...prev, grade: e.target.value }));
        break;
      default:
        break;
    }
  }

  return (
    <>
      {editOpen && (
        <ProfessorSubmit setEditOpen={setEditOpen} updateRows={setUpdate} />
      )}
      <div className="professors">
        {auth.role === 1 && (
          <button onClick={handleProfSubmit}>+ ???????????? ??????????</button>
        )}
        <div className="filter-side">
          <label htmlFor="">????????:</label>
          <select name="fos" onChange={handleFilterChange} value={filters.fos}>
            <option value="all">??????</option>
            {!fosLoading &&
              fosList &&
              fosList.map((fos: any) => (
                <option value={fos.id} key={fos.id}>
                  {fos.name}
                </option>
              ))}
          </select>
          <label htmlFor="">??????:</label>
          <select
            name="kind"
            onChange={handleFilterChange}
            value={filters.kind}
          >
            <option value="all">??????</option>
            <option value="0">???????? ????????</option>
            <option value="1">????????</option>
          </select>
          <label htmlFor="">?????????? ????????:</label>
          <select
            name="grade"
            onChange={handleFilterChange}
            value={filters.grade}
          >
            <option value="all">??????</option>
            <option value="1">????????????????</option>
            <option value="2">???????????????? ????????</option>
            <option value="3">??????????</option>
          </select>
          <button onClick={handleFilterClick}>
            ??????????
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>???????? ????????????:</h3>
        <table>
          <thead>
            <tr>
              <th>?????? ?? ?????? ????????????????</th>
              <th>????????</th>
              <th>??????????</th>
              <th>??????</th>
              <th>????????</th>
              <th>????????</th>
              {auth.role === 1 && <th>??????????????</th>}
            </tr>
          </thead>
          <tbody>
            {!loading && professors.result?.length ? (
              professors.result.map((professor: any) => (
                <ProfessorRow
                  key={professor.id}
                  professor={professor}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={7} className="has-no-row">
                  ???????????? ???????? ?????????? ???????? ??????????
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(professors.totallItems / 40) !== 1 &&
        Math.ceil(professors.totallItems / 40) !== 0 && (
          <div className="pagiMagi" style={{ direction: "rtl" }}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                professors.totallItems
                  ? Math.ceil(professors.totallItems / 40)
                  : 0
              }
              previousLabel="<"
              renderOnZeroPageCount={() => null}
            />
          </div>
        )}
      {(loading || fosLoading) && <LoadingModal />}
    </>
  );
}

export default Professors;
