
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './DashBoard.jsx';
import Index from './Index.jsx'
import Login from './Login.jsx'
import Signup from './Signup.jsx'
import Error from './Error.jsx'
import Details from './details.jsx'
import Wishlist from './Wishlist.jsx';

const router = createBrowserRouter([
  {
    path:"",
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
        element:<Details/>
      },
      {
        path:'wishlist',
        element:<Wishlist/>
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
