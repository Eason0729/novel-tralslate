import ErrorPage from "../components/ErrorPage.tsx";

export default function Error404() {
  return (
    <ErrorPage
      code="404"
      message="Oops! The page you're looking for doesn't exist."
      f-client-nav
    />
  );
}
