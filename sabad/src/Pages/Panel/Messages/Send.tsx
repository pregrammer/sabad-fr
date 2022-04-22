import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import LoadingModal from "../../../Components/Modals/LoadingModal";
import { useAuth } from "../../../Components/Contexts/AuthProvider";
import useAxiosFunction from "../../../Helpers/useAxiosFunction";
import { useEffect } from "react";

function Send() {
  const { auth } = useAuth();

  const [users, loading, axiosFetch]: any = useAxiosFunction();
  const [submitData, submitLoading, axiosFetch2]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: "/users/for-select",
    });
    // eslint-disable-next-line
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      body: "",
      to_user_id: auth.id,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("وارد کردن عنوان پیام الزامی است")
        .max(280, "حداکثر تعداد کاراکتر 280 می باشد"),
      body: Yup.string()
        .required("وارد کردن متن پیام الزامی است")
        .max(2800, "حداکثر تعداد کاراکتر 2800 می باشد"),
    }),
    onSubmit: (values) => {
      axiosFetch2({
        method: "POST",
        url: "/messages",
        requestConfig: {
          headers: {
            "Content-Type": "application/json",
          },
          data: values,
        },
      });
    },
  });

  useEffect(() => {
    if (Object.keys(submitData).length !== 0) {
      toast.success(submitData.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      formik.setFieldValue("title", "");
      formik.setFieldValue("body", "");
      formik.setFieldValue("to_user_id", auth.id);
    }
  }, [submitData]);

  return (
    <>
      <div className="send-container">
        <form onSubmit={formik.handleSubmit}>
          <input
            type="text"
            placeholder="عنوان پیام"
            required
            id="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="error">{formik.errors.title}</div>
          )}
          <textarea
            placeholder="متن پیام"
            required
            id="body"
            value={formik.values.body}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.body && formik.errors.body && (
            <div className="error">{formik.errors.body}</div>
          )}
          <div className="down">
            <label htmlFor="send_select">به:</label>
            <select
              id="to_user_id"
              value={formik.values.to_user_id}
              onChange={formik.handleChange}
            >
              <option value={auth.id}>خودم</option>
              <option value="sgm">مدیر گروه های تخصصی</option>
              <option value="ggm">مدیر گروه های عمومی</option>
              {!loading &&
                users &&
                users.map((user: any) => (
                  <option value={user.id} key={user.id}>
                    {user.firstName} {user.lastName} (
                    {user.role === 1
                      ? "مدیر آموزش "
                      : user.role === 2 || user.role === 3
                      ? "مدیر گروه "
                      : "کارشناس گروه "}
                    {user.field_of_study_name})
                  </option>
                ))}
            </select>
            <button type="submit">
              ارسال
              <FontAwesomeIcon icon={faPaperPlane} className="send-icon" />
            </button>
          </div>
        </form>
      </div>
      {(loading || submitLoading) && <LoadingModal />}
    </>
  );
}

export default Send;
