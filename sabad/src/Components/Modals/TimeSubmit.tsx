import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "./LoadingModal";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function TimeSubmit({ setIsOpen, editData, updateRows }: any) {
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  const formik: any = useFormik({
    initialValues: {
      start: editData ? editData.start : "",
      end: editData ? editData.end : "",
    },
    validationSchema: Yup.object({
      start: Yup.string().required("وارد کردن ساعت ابتدایی الزامی است"),
      end: Yup.string().required("وارد کردن ساعت پایانی الزامی است"),
    }),
    onSubmit: (values) => {
      if (!editData) {
        axiosFetch({
          method: "POST",
          url: "/times",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: values,
          },
        });
      } else {
        axiosFetch({
          method: "PUT",
          url: "/times",
          requestConfig: {
            headers: {
              "Content-Type": "application/json",
            },
            data: {
              id: editData.id,
              ...values
            },
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
      setIsOpen((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <div
        className="bgc-modal"
        onClick={() => setIsOpen((prev: any) => !prev)}
      ></div>
      <div className="time-submit-content">
        <span className="close" onClick={() => setIsOpen((prev: any) => !prev)}>
          &times;
        </span>
        <form onSubmit={formik.handleSubmit}>
          <h4>{editData ? "ویرایش" : "افزودن"} ساعت</h4>

          <div>
            <label htmlFor="">از ساعت:</label>
            <input
              type="number"
              required
              name="start"
              value={formik.values.start}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label htmlFor="">تا ساعت:</label>
            <input
              type="number"
              required
              name="end"
              value={formik.values.end}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </div>
          <button type="submit">{editData ? "ویرایش" : "افزودن"}</button>
        </form>
        {formik.touched.start && formik.errors.start && (
          <div className="error">{formik.errors.start}</div>
        )}
        {formik.touched.end && formik.errors.end && (
          <div className="error-left">{formik.errors.end}</div>
        )}
      </div>
      {loading && <LoadingModal />}
    </>
  );
}

export default TimeSubmit;
