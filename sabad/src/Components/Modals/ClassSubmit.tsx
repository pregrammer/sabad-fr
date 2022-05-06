import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function ClassSubmit({ setEditOpen, editData, updateRows }: any) {
  const [collegeList, collegeLoading, axiosFetch2]: any = useAxiosFunction();
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch2({
      method: "GET",
      url: "/colleges?forSelect=true",
    });
  }, []);

  const formik: any = useFormik({
    initialValues: {
      title: editData ? editData.title : "",
      hasProjector: editData ? editData.hasProjector : "1",
      capacity: editData ? editData.capacity : "",
      college_id: editData ? editData.college_id : "",
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("وارد کردن عنوان دانشکده لازم است")
        .max(50, "حداکثر تعداد کاراکتر 50 می باشد"),
    }),
    onSubmit: (values) => {
      // college: because we first put college to "" and if select doesnt trigger, college remain "".
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/classes",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              title: values.title,
              hasProjector: values.hasProjector,
              capacity: values.capacity,
              college_id:
                values.college_id === ""
                  ? collegeList[0].id
                  : values.college_id,
            },
          },
        });
      } else {
        const dataPut = {
          id: editData.id,
          title: values.title,
          hasProjector: values.hasProjector,
          capacity: values.capacity,
          college_id:
            values.college_id === "" ? collegeList[0].id : values.college_id,
        };
        axiosFetch({
          method: "PUT",
          url: "/classes",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: dataPut,
          },
        });
      }
    },
  });

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      toast.success(data.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      updateRows((prev: any) => !prev);
      setEditOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setEditOpen((prev: any) => !prev)}
      ></div>
      <div className="class-submit-content">
        <span
          className="close"
          onClick={() => setEditOpen((prev: any) => !prev)}
        >
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} کلاس</h4>
          <div className="group">
            <div>
              <label>عنوان:</label>
              <input
                type="text"
                required
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </div>
            {formik.touched.title && formik.errors.title && (
              <span className="error">{formik.errors.title}</span>
            )}

            <div>
              <label>پروژکتور:</label>
              <select
                name="hasProjector"
                value={formik.values.hasProjector}
                onChange={formik.handleChange}
              >
                <option value="0">ندارد</option>
                <option value="1">دارد</option>
              </select>
            </div>
          </div>
          <div className="group">
            <div>
              <label>ظرفیت:</label>
              <input
                type="number"
                required
                name="capacity"
                value={formik.values.capacity}
                onChange={formik.handleChange}
              />
            </div>
            {formik.touched.capacity && formik.errors.capacity && (
              <span className="error">{formik.errors.capacity}</span>
            )}
            <div>
              <label>دانشکده:</label>
              <select
                name="college_id"
                value={formik.values.college_id}
                onChange={formik.handleChange}
              >
                {!collegeLoading &&
                  collegeList &&
                  collegeList.map((college: any) => (
                    <option value={college.id} key={college.id}>
                      {college.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
      </div>
      {(loading || collegeLoading) && <LoadingModal />}
    </>
  );
}

export default ClassSubmit;
