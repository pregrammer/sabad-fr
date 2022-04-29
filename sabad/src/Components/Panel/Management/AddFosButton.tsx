function AddFosButton({ openAdd, setOpenAdd }: any) {
  function handleClick() {
    setOpenAdd((prev: boolean) => !prev);
  }
  return (
    <button onClick={handleClick} className={openAdd ? "close-form" : ""}>
      {openAdd ? "بستن" : "+ افزودن رشته"}
    </button>
  );
}

export default AddFosButton;
