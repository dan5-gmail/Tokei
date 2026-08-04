import { useLocation } from "react-router-dom";

export default function PageNotFound() {

  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">

      <div className="text-center">

        <h1 className="text-7xl font-light text-slate-300">
          404
        </h1>

        <h2 className="text-2xl mt-4 text-slate-800">
          Page Not Found
        </h2>

        <p className="mt-3 text-slate-600">
          "{pageName}" could not be found.
        </p>


        <button
          onClick={() => window.location.href = "/"}
          className="
          mt-6 px-4 py-2
          rounded-lg
          bg-white
          border
          hover:bg-slate-50
          "
        >
          Go Home
        </button>

      </div>

    </div>
  );
}