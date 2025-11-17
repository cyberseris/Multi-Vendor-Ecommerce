import { privateRoutes } from "./privateRoutes"
import publicRoutes from "./publicRoutes"
import MainLayout from "../../layout/MainLayout"
import ProtectRoute from "./ProtectRoute"

export const getRoutes = () => {
    privateRoutes.forEach(r => {
        r.element = <ProtectRoute route={r}> {r.element} </ProtectRoute>
    })

    return {
        path: '/',
        element: <MainLayout />,
        children: privateRoutes
    }
}

// 導出所有路由（公開 + 私有）
export const allRoutes = [
    ...publicRoutes,
    getRoutes()
]