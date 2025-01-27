import { Link } from "react-router-dom";
import { Typography } from "./Typography";

function CreateNewAccountCTA({ labelName, route, name }: any) {
  return (
    <div className="flex items-center justify-center m-auto gap-4 mt-4">
      <Typography as="h1" className="font-sans text-gray-500 ">
        {labelName}
        <Link
          to={route}
          className="border-b border-blue-400 p-0.5 ml-1 font-sans text-blue-400 font-semibold"
        >
          {name}
        </Link>
      </Typography>
    </div>
  );
}

export default CreateNewAccountCTA;
