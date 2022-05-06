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
    fos: auth.field_of_study_id ? auth.field_of_study_id : "all",
    termNumber: "all",
    kind: "all",
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
        <button onClick={handleProfSubmit}>+ افزودن درس</button>
        <div className="filter-side">
          <label htmlFor="">رشته:</label>
          <select name="fos" onChange={handleFilterChange} value={filters.fos}>
            <option value="all">همه</option>
            {!fosLoading &&
              fosList &&
              fosList.map((fos: any) => (
                <option value={fos.id} key={fos.id}>
                  {fos.name}
                </option>
              ))}
          </select>
          <label htmlFor="">ورودی:</label>
          <select name="termNumber" onChange={handleFilterChange}>
            <option value="all">همه</option>
            <option value="odd">فرد</option>
            <option value="even">زوج</option>
            <option value="1">ترم یک</option>
            <option value="2">ترم دو</option>
            <option value="3">ترم سه</option>
            <option value="4">ترم چهار</option>
            <option value="5">ترم پنج</option>
            <option value="6">ترم شش</option>
            <option value="7">ترم هفت</option>
            <option value="8">ترم هشت</option>
          </select>
          <label htmlFor="">نوع:</label>
          <select name="kind" onChange={handleFilterChange}>
            <option value="all">همه</option>
            <option value="معارف">معارف</option>
            <option value="عمومی">عمومی</option>
            <option value="پایه">پایه</option>
            <option value="اصلی">اصلی</option>
            <option value="تخصصی">تخصصی</option>
            <option value="اختیاری">اختیاری</option>
            <option value="کارگاهی - آزمایشگاهی">کارگاهی - آزمایشگاهی</option>
          </select>
          <button onClick={handleFilterClick}>
            فیلتر
            <FontAwesomeIcon icon={faFilter} />
          </button>
        </div>
        <h3>لیست دروس:</h3>
        <table>
          <thead>
            <tr>
              <th>نام درس</th>
              <th>تعداد واحد</th>
              <th>نوع</th>
              <th>کد درس</th>
              <th>ورودی</th>
              <th>مقطع</th>
              <th>پیش نیاز</th>
              <th>هم نیاز</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              courses.result?.length &&
              courses.result.map((course: any) => (
                <CourseRow
                  key={course.id}
                  course={course}
                  setUpdate={setUpdate}
                />
              ))}
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
