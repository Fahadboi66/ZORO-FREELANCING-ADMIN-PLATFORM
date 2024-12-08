import { Link } from "react-router-dom";

export default function Footer() {
  return (
      <footer className="bg-[#0B1724] rounded-sm shadow ">
        <div className="w-full mx-auto max-w-screen-xl p-4  md:flex md:items-center md:justify-around">
          <span className="text-sm text-[#cae962] sm:text-center ">
            © 2024{" "}
              ZORO
            . All Rights Reserved.
          </span>
          <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-[#cae962]  sm:mt-0">
            <li>
              <Link to={'/about'} className="hover:underline me-4 md:me-6">
                About
              </Link>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licensing
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </footer>
  );
}
