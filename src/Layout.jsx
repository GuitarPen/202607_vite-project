import { Outlet, NavLink } from "react-router-dom";
function Layout() {
  return <>
    <h1>鉛筆的賣場</h1>
    <nav>
      <NavLink to="/">Home</NavLink>｜
      <NavLink to="/products">Products</NavLink>｜
      <NavLink to="/cart">Cart</NavLink>｜
      <NavLink to="/admin">進入後台</NavLink>
    </nav>
    <hr />
    <main>
      <Outlet />
    </main>
    <hr />
    <footer>
      <p>&copy; 2023 My App. All rights reserved.</p>
    </footer>
  </>
}

export default Layout