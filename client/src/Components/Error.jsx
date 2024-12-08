import { Link } from "react-router-dom";

export default function Error() {
  return (
    <div className="flex text-center justify-center align-middle">
      <div className="mt-44">
        <h1 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl italic">
          Oops! 404 Error - This Page Does Not Exist.
        </h1>
        <button className="p-3 bg-slate-900 rounded mt-6 text-white">
          <Link to={"/"}>Go to Home Page</Link>
        </button>
      </div>
    </div>
  );
}
