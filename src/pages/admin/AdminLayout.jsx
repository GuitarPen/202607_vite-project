import { Outlet, NavLink } from "react-router-dom";
function AdminLayout() {
    return <>
        <h1>後台管理</h1>
        <nav>
            <NavLink to="/">回前台</NavLink>｜
            <NavLink to="/admin">Products</NavLink>｜
            <NavLink to="/admin/orders">Orders</NavLink>｜
        </nav>
        <hr />
        <main>
            <Outlet />
        </main>
    </>
}

export default AdminLayout