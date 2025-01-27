import { Typography } from "./custom/Typography";

type AppProps = {
  message?: string;
};
const PageNotFound = ({ message = "ERROR!" }: AppProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <Typography as="h2" className="text-base font-bold">
          {message}
        </Typography>
        <Typography
          as="h2"
          className="xl:text-[200px] lg:text-[180px] md:text-[150px] text-[110px] text-gray-700 font-[650]"
        >
          404
        </Typography>
        <Typography
          as="p"
          className="xl:text-[60px] lg:text-[50px] md:text-[30px] text-[25px] text-gray-700 font-[450]"
        >
          Page Not Found
        </Typography>
      </div>
    </div>
  );
};

export default PageNotFound;
