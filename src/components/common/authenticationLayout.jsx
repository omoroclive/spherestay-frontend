import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import SpherestayLogo from '@/assets/images/spherestay_kenya_logo.svg'

const authenticationLayout = () => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <img 
            src={SpherestayLogo} 
            alt="Spherestay Kenya Logo"
            className="mx-auto h-16 w-auto"
          />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Kenya Travel Platform
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default authenticationLayout