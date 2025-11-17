import React, {Suspense} from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectRoute = ({route, children}) => {
    const { role, userInfo } = useSelector(state => state.auth)
    console.log("ProtectRoute userInfo 1:", userInfo);

    // 沒有 role（token），導向登入頁
    if(!role){
        return <Navigate to='/login' replace />
    }

    // 有 role 但沒有 userInfo，需要等待 API 回應或使用 token 中的 role
    if(!userInfo || !userInfo.role){
        // 暫時使用 token 解碼的 role 進行判斷
        if(role === route.role){
            return <Suspense fallback={null} >{children}</Suspense>
        }else{
            return <Navigate to='/unauthorized' replace />
        }
    }


    // 有 userInfo，使用後端返回的實際 role
    if(userInfo.role === route.role){
        /* console.log("ProtectRoute userInfo 1:", userInfo); */
        console.log("ProtectRoute userInfo 2:", userInfo);
        if(route.status){
            // userInfo.status: firefox redux
            // userInfo.status: db user status
            if(route.status === userInfo.status){
                console.log("ProtectRoute userInfo 4:", userInfo);
                return <Suspense fallback={null} >{children}</Suspense>
            }else{
                console.log("ProtectRoute userInfo 3:", userInfo);
                if(userInfo.status === 'pending'){
                    return <Navigate to='/seller/account-pending' replace />
                }else{
                    return <Navigate to='/seller/account-deactive' replace />
                }
            } 

        }else{
            if(route.visibility){
                console.log("ProtectRoute userInfo 5:", userInfo);
                // if(route.visibility.some(r => r === userInfo.status))
                if(route.visibility.includes(userInfo.status)){
                    return <Suspense fallback={null} >{children}</Suspense>
                }else{
                    console.log("ProtectRoute userInfo 6:", userInfo);
                    return <Navigate to='/seller/account-pending' replace />
                }
            }else{
                console.log("ProtectRoute userInfo 7:", userInfo);
                return <Navigate to='/seller/account-pending' replace />
            }

        }


    }else{
        console.log("ProtectRoute userInfo 2:", userInfo);
        //return <Navigate to='/unauthorized' replace />
    }
};

export default ProtectRoute;