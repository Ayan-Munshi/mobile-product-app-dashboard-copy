import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./PrivateRoutes";
import PublicRoutes from "./PublicRoutes";
import Layout from "@/lib/layout";
import PageNotFound from "@/components/PageNotFound";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
type RoutesType = {
  path: string;
  key: string;
  component: any;
  isPrivate: boolean;
  exact: boolean;
};

type AppProps = {
  routes: RoutesType[];
  token: string | null;
};

export function RenderRoutes({ routes }: AppProps) {
  const isAuth = useSelector(
    (state: RootState) => state.persisted.practice.isAuth
  );
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      {routes?.map((route: RoutesType) => {
        const { isPrivate, key, path } = route;
        return (
          <Route
            key={key}
            path={path}
            element={
              isPrivate && isAuth ? (
                <Layout>
                  <PrivateRoutes component={route.component} />
                </Layout>
              ) : !isPrivate ? (
                <PublicRoutes component={route.component} />
              ) : (
                <Navigate to="/login" />
              )
            }
          ></Route>
        );
      })}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
// logic of which route logics
