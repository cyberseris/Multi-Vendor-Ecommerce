import { useEffect } from 'react';
import Router from './router/Router';
import { Toaster } from 'react-hot-toast';
import { allRoutes } from './router/routes';
import { useDispatch, useSelector } from 'react-redux';
import { get_user_info } from './store/Reducers/authReducer';

function App() {
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);
  
  useEffect(() => {
    if (token) {
      dispatch(get_user_info())
    }
  }, [token])
  
  return (
    <>
      <Router allRoutes={allRoutes} />
      <Toaster 
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#283046',
            color: 'white',
          },
          success: {
            style: {
              background: '#10B981',
            },
          },
          error: {
            style: {
              background: '#EF4444',
            },
          },
        }}
      />
    </>
  )
}

export default App;
