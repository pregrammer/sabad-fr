import "../../../Styles/classes.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ClassRow from "../../../Components/Panel/Classes/ClassRow";
import ClassSubmit from "../../../Components/Modals/ClassSubmit";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import { useAuth } from "../../../Components/Contexts/AuthProvider";

function Classes() {
  const [editOpen, setEditOpen] = useState(false);
  const [collegeList, collegeLoading, axiosFetch2]: any = useAxiosFunction();
  const [classes, loading, axiosFetch]: any = useAxiosFunction();
  const [pageNumber, setPageNumber] = useState(1);
  const [update, setUpdate] = useState(false);
  const { auth } = useAuth();
  const [filters, setFilters] = useState({
    college_id: "all",
    hasProjector: "all",
    capacity: "all",
  });

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: `/colleges?forSelect=true`,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/classes?page=${pageNumber}&limit=40&college_id=${filters.college_id}&hasProjector=${filters.hasProjector}&capacity=${filters.capacity}`,
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
      case "college_id":
        setFilters((prev: any) => ({ ...prev, college_id: e.target.value }));
        break;
      case "hasProjector":
        setFilters((prev: any) => ({ ...prev, hasProjector: e.target.value }));
        break;
      case "capacity":
        setFilters((prev: any) => ({ ...prev, capacity: e.target.value }));
        break;
      default:
        break;
    }
  }

  return (
    <>
      {editOpen && (
        <ClassSubmit setEditOpen={setEditOpen} updateRows={setUpdate} />
      )}
      <div className="classes">
        {auth.role === 1 && (
          <button onClick={handleProfSubmit}>+ ???????????? ????????</button>
        )}
        <div className="filter-side">
          <label htmlFor="">??????????????:</label>
          <select
            name="college_id"
            onChange={handleFilterChange}
            value={filters.college_id}
          >
            <option value="all">??????</option>
            {!collegeLoading &&
              collegeList &&
              collegeList.map((college: any) => (
                <option value={college.id} key={college.id}>
                  {college.name}
                </option>
              ))}
          </select>
          <label htmlFor="">????????????????:</label>
          <select
            name="hasProjector"
            onChange={handleFilterChange}
            value={filters.hasProjector}
          >
            <option value="all">??????</option>
            <option value="0">???????? ????????????????</option>
            <option value="1">???? ????????????????</option>
          </select>
          <label htmlFor="">??????????:</label>
          <select
            name="capacity"
            onChange={handleFilterChange}
            value={filters.capacity}
          >
            <option value="all">??????</option>
            <option value="30">???????? ???? 30 ??????</option>
            <option value="3050">30 ???? 50 ??????</option>
            <option value="50">?????????? ???? 50 ??????</option>
          </select>
          <button onClick={handleFilterClick}>
            ??????????
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>???????? ???????? ????:</h3>
        <table>
          <thead>
            <tr>
              <th>??????????</th>
              <th>????????????????</th>
              <th>??????????</th>
              <th>??????????????</th>
              <th>????????????{auth.role === 1 && " / ??????????????"}</th>
            </tr>
          </thead>
          <tbody>
            {!loading && classes.result?.length ? (
              classes.result.map((kelas: any) => (
                <ClassRow key={kelas.id} kelas={kelas} setUpdate={setUpdate} />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="has-no-row">
                  ?????????? ???????? ?????????? ???????? ??????????
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(classes.totallItems / 40) !== 1 &&
        Math.ceil(classes.totallItems / 40) !== 0 && (
          <div className="pagiMagi" style={{ direction: "rtl" }}>
            <ReactPaginate
              breakLabel="..."
              nextLabel=">"
              onPageChange={handlePageClick}
              pageRangeDisplayed={4}
              pageCount={
                classes.totallItems ? Math.ceil(classes.totallItems / 40) : 0
              }
              previousLabel="<"
              renderOnZeroPageCount={() => null}
            />
          </div>
        )}
      {(loading || collegeLoading) && <LoadingModal />}
    </>
  );
}

export default Classes;
