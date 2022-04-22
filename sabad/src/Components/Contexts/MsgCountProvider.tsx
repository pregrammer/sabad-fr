import { createContext, useContext, useState, useEffect } from "react";
import useAxiosFunction from "../../Helpers/useAxiosFunction";
import LoadingModal from "../Modals/LoadingModal";

const msgCountContext = createContext({
  count: 0,
  setRefreshCount: (bool: any) => {},
});

export const useMsgCount = () => {
  return useContext(msgCountContext);
};

const MsgCountProvider = ({ children }: any) => {
  const [count, setCount]: [any, any] = useState(0);
  const [refreshCount, setRefreshCount] = useState(false);
  const [data, loading, axiosFetch]: any = useAxiosFunction();

  useEffect(() => {
    axiosFetch({
      method: "GET",
      url: "/messages/unseen-count",
    });
  }, [refreshCount]);

  useEffect(() => {
    if (Object.keys(data).length !== 0) {
      setCount(data.count);
    }
  }, [data]);

  return (
    <>
      <msgCountContext.Provider value={{ count, setRefreshCount }}>
        {children}
      </msgCountContext.Provider>
      {loading && <LoadingModal />}
    </>
  );
};

export default MsgCountProvider;
