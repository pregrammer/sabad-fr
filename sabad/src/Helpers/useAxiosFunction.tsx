import { toast } from "react-toastify";
import { useAuth } from "../Components/Contexts/AuthProvider";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";


const useAxiosFunction = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const [controller, setController] = useState<any>();

  const axiosFetch = async (configObj: any) => {
    const {
      method,
      url,
      requestConfig = {},
      axiosInstance = axios,
    } = configObj;

    try {
      setLoading(true);
      const ctrl = new AbortController();
      setController(ctrl);
      const mthd = method.toLowerCase();
      const res = await axiosInstance[mthd](url, {
        ...requestConfig,
        signal: ctrl.signal,
      });
      setData(res.data);
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401 || error.response.status === 403) {
          if (Object.keys(auth).length !== 0) {
            setAuth({});
            navigate("/", { replace: true });
          }
        } else {
          toast.error(error.response.data.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // useEffect cleanup function
    return () => controller && controller.abort();
  }, [controller]);

  //console.log(data);
  return [data, loading, axiosFetch];
};

export default useAxiosFunction;

/*
// get
  axiosInstance: axios,
  method: 'GET',
  url: '/',
  requestConfig: {
      headers: {
          'Content-Language': 'en-US',
          //'Accept': 'text/html'
      }
  }

// post
  axiosInstance: axios,
  method: 'post',
  url: '/posts',
  requestConfig: {
      data: {
          userId: 10,
          title: 'Axios Stuff',
          body: 'Axios hook stuff'
      }
  }
*/
