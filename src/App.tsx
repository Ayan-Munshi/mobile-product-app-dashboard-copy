import ROUTES from "./routes/allRoutes";
import { RenderRoutes } from "./routes/routes";
import { useSelector } from "react-redux";
import { RootState } from "./redux/store";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

const sanitize_title = (text: string) => {
  const updatedText = text.replace(/-/g, " ").toLowerCase();
  const capitalizedText =
    updatedText.charAt(0).toUpperCase() + updatedText.slice(1);
  return capitalizedText;
};

function App() {
  const location = useLocation();
  const token = useSelector(
    (state: RootState) => state.persisted.practice.token
  );

  return (
    <div className="main">
      <Helmet>
        <title>
          {sanitize_title(location?.pathname?.split("/")[1])} - All in One
          Dental
        </title>
      </Helmet>
      <RenderRoutes routes={ROUTES} token={token} />
    </div>
  );
}

export default App;
