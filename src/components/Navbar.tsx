import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-green-700 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center flex-row">
          <h1 className="text-white text-lg">E-Commerce</h1>
          <ul className="flex space-x-4 mt-2">
            <li>
              <Link to="/" className="text-white hover:text-gray-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="text-white hover:text-gray-300">
                Products
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
