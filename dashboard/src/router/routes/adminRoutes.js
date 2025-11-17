import { lazy } from "react"
const AdminDashboard = lazy(()=> import('../../views/admin/AdminDashboard'))
const Orders = lazy(()=> import('../../views/admin/Orders'))
const Category = lazy(()=> import('../../views/admin/Category'))
const Sellers = lazy(()=> import('../../views/admin/Sellers'))
const PaymentRequest = lazy(()=> import('../../views/admin/PaymentRequest'))
const DeactiveSellers = lazy(()=> import('../../views/admin/DeactiveSellers'))
const SellerRequest = lazy(()=> import('../../views/admin/SellerRequest'))
const SellerDetails = lazy(()=> import('../../views/admin/SellerDetails'))
const ChatSeller = lazy(()=> import('../../views/admin/ChatSeller'))
const OrderDetails = lazy(()=> import('../../views/admin/OrderDetails'))

export const adminRoutes = [
    {
        path: 'admin/dashboard',
        element: <AdminDashboard />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/orders',
        element: <Orders />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/category',
        element: <Category />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/sellers',
        element: <Sellers />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/payment-request',
        element: <PaymentRequest />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/deactive-sellers',
        element: <DeactiveSellers />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/sellers-request',
        element: <SellerRequest />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/seller/details/:sellerId',
        element: <SellerDetails />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/chat-sellers',
        element: <ChatSeller />,
        role: 'admin',
        status: 'active'
    },
    {
        path: 'admin/dashboard/order/details/:orderId',
        element: <OrderDetails />,
        role: 'admin',
        status: 'active'
    },
]