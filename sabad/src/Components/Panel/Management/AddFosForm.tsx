import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import LoadingModal from "../../Modals/LoadingModal";

function AddFosForm({ setOpenAdd, updateRows }: any) {
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  const formik: any = useFormik({
    initialValues: {
      fos: "",
    },
    validationSchema: Yup.object({
      fos: Yup.string()
        .required("وارد کردن نام رشته الزامی است")
        .max(50, "حداکثر تعداد کاراکتر 50 می باشد"),
    }),
    onSubmit: (values) => {
      axiosFetch({
        method: "POST",
        url: "/field_of_studies",
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            name: values.fos,
          },
        },
      });
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
      setOpenAdd((prev: any) => !prev);
    }
  }, [data]);

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="text"
          name="fos"
          required
          value={formik.values.fos}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <button type="submit">افزودن</button>
        {formik.touched.fos && formik.errors.fos && (
          <div className="error">{formik.errors.fos}</div>
        )}
      </form>
      {loading && <LoadingModal />}
    </>
  );
}

export default AddFosForm;
