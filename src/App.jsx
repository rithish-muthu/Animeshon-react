
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './Pages/DashBoard.jsx'
import Index from './Index.jsx'
import Login from './Pages/Login.jsx'
import Signup from './Pages/Signup.jsx'
import Error from './Pages/Error.jsx'
import Wishlist from './Pages/Wishlist.jsx';
import AnimeDetails from './Pages/AnimeDetails.jsx';
import Playing from './Pages/Playing.jsx';


const router = createBrowserRouter([
  {
    path:"/",
    element:<Index/>,
    errorElement:<Error/>,
    children:[
      {
        path:'',
        element:<Dashboard/>
      },
      {
        path:'login',
        element:<Login/>
      },
      {
        path:'signup',
        element:<Signup/>
      },
      {
        path:'details/:movieName',
        element:<AnimeDetails/>
      },
      {
        path:'wishlist',
        element:<Wishlist/>
      },
      {
        path:'playing/:id',
        element:<Playing/>
      }
    ]
  }
])

function App() {

  return (
    <RouterProvider router={router}/>
  )
}

export default App
