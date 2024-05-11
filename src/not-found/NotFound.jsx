import { NavLink } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      Page not found, return to the home Page
      <NavLink to={"./"}>Go to home Page</NavLink>
    </div>
  );
}
