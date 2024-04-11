import "./App.css";
import QueryProvider from "./component/Provider/QueryProvider";
import Router from "./component/Router";

function App() {
  return (
    <>
      <QueryProvider>
        {/* <AuthProvider> */}
        <Router />
        {/* </AuthProvider> */}
      </QueryProvider>
    </>
  );
}

export default App;
