import { Outlet } from "react-router-dom";
import Header from "../Headers";
import Footers from "../Footers";

function LayoutDefault() {

  return (
    <>
      <header>
        <Header />
      </header>
      <main >
        <Outlet />
      </main>
      <footer>
        <Footers />
      </footer>
    </>
  );
}
export default LayoutDefault;
