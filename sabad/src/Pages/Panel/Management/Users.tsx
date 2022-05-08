import { useState, useEffect } from "react";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import UserSubmit from "../../../Components/Modals/UserSubmit";
import UserRow from "../../../Components/Panel/Management/UserRow";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import ReactPaginate from "react-paginate";

function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, loading, axiosFetch]: any = useAxiosFunction();
  const [update, setUpdate] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: `/users?page=${pageNumber}&limit=20`,
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
      {isOpen && <UserSubmit setIsOpen={setIsOpen} updateRows={setUpdate} />}
      <div className="users-container">
        <button onClick={handleClick}>+ افزودن کاربر</button>
        <h2>لیست کاربران:</h2>
        <table>
          <thead>
            <tr>
              <th>نام و نام خانوادگی</th>
              <th>سمت</th>
              <th>رشته</th>
              <th>ایمیل</th>
              <th>شماره تلفن</th>
              <th>تغییرات</th>
            </tr>
          </thead>
          <tbody>
            {!loading && users.result?.length ? (
              users.result.map((user: any) => (
                <UserRow key={user.id} user={user} setUpdate={setUpdate} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="has-no-row">
                  کاربری برای نمایش وجود ندارد
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {Math.ceil(users.totallItems / 20) !== 1 && (
        <div className="pagiMagi">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={4}
            pageCount={
              users.totallItems ? Math.ceil(users.totallItems / 20) : 0
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

export default Users;
