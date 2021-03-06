import "../../Styles/courses.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useAuth } from "../../Components/Contexts/AuthProvider";
import LoadingModal from "../../Components/Modals/LoadingModal";
import ReactPaginate from "react-paginate";
import CourseRow from "../../Components/Panel/Courses/CourseRow";
import CourseSubmit from "../../Components/Modals/CourseSubmit";

function Courses() {
  const [editOpen, setEditOpen] = useState(false);
  const [fosList, fosLoading, axiosFetch2]: any = useAxiosFunction();
  const [courses, loading, axiosFetch]: any = useAxiosFunction();
  const [pageNumber, setPageNumber] = useState(1);
  const [update, setUpdate] = useState(false);
  const { auth } = useAuth();
  const [filters, setFilters] = useState({
    fos: auth.field_of_study_id,
    termNumber: "all",
    kind: "all",
  });

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: `/field_of_studies?forSelect=true`,
    });
  }, []);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/courses?page=${pageNumber}&limit=40&field_of_study_id=${filters.fos}&kind=${filters.kind}&termNumber=${filters.termNumber}`,
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
    // if user refresh the page, auth removed. we instead use first fos.
    if (!filters.fos) {
      setFilters((prev: any) => ({
        ...prev,
        fos: fosList[0].id,
      }));
    }
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
      case "termNumber":
        setFilters((prev: any) => ({ ...prev, termNumber: e.target.value }));
        break;
      default:
        break;
    }
  }

  return (
    <>
      {editOpen && (
        <CourseSubmit setEditOpen={setEditOpen} updateRows={setUpdate} />
      )}
      <div className="courses">
        {auth.role === 2 && (
          <button onClick={handleProfSubmit}>+ ???????????? ??????</button>
        )}
        <div className="filter-side">
          <label htmlFor="">????????:</label>
          <select name="fos" onChange={handleFilterChange} value={filters.fos}>
            {!fosLoading &&
              fosList &&
              fosList.map((fos: any) => (
                <option value={fos.id} key={fos.id}>
                  {fos.name}
                </option>
              ))}
          </select>
          <label htmlFor="">??????????:</label>
          <select name="termNumber" onChange={handleFilterChange}>
            <option value="all">??????</option>
            <option value="odd">??????</option>
            <option value="even">??????</option>
            <option value="1">?????? ????</option>
            <option value="2">?????? ????</option>
            <option value="3">?????? ????</option>
            <option value="4">?????? ????????</option>
            <option value="5">?????? ??????</option>
            <option value="6">?????? ????</option>
            <option value="7">?????? ??????</option>
            <option value="8">?????? ??????</option>
          </select>
          <label htmlFor="">??????:</label>
          <select name="kind" onChange={handleFilterChange}>
            <option value="all">??????</option>
            <option value="??????????">??????????</option>
            <option value="??????????">??????????</option>
            <option value="????????">????????</option>
            <option value="????????">????????</option>
            <option value="??????????">??????????</option>
            <option value="??????????????">??????????????</option>
            <option value="?????????????? - ????????????????????">?????????????? - ????????????????????</option>
          </select>
          <button onClick={handleFilterClick}>
            ??????????
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>???????? ????????:</h3>
        <table>
          <thead>
            <tr>
              <th>?????? ??????</th>
              <th>?????????? ????????</th>
              <th>??????</th>
              <th>???? ??????</th>
              <th>??????????</th>
              <th>????????</th>
              <th>?????? ????????</th>
              <th>???? ????????</th>
              {auth.role === 2 && <th>??????????????</th>}
            </tr>
          </thead>
          <tbody>
            {!loading && courses.result?.length ? (
              courses.result.map((course: any) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  setUpdate={setUpdate}
                />
              ))
            ) : (
              <tr>
                <td colSpan={9} className="has-no-row">
                  ???????? ???????? ?????????? ???????? ??????????
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(courses.totallItems / 40) !== 1 &&
        Math.ceil(courses.totallItems / 40) !== 0 && (
          <div className="pagiMagi" style={{ direction: "rtl" }}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                courses.totallItems ? Math.ceil(courses.totallItems / 40) : 0
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

export default Courses;
