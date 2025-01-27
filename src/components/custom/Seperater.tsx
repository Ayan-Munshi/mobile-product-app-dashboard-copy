function Seperater({ width = "full" }) {
  return (
    <div
      className={`flex items-center justify-center m-auto gap-4`}
      style={{ width: `${width}` }}
    >
      <hr className="flex-grow border-t border-gray-500" />
      <p className=" text-gray-500 font-medium font-sans">or</p>
      <hr className="flex-grow border-t border-gray-500" />
    </div>
  );
}

export default Seperater;
