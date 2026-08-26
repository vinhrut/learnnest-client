import { Suspense } from 'react'
import { RouterProvider } from 'react-router-dom'
import RenderRouter from './routes'

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Đang tải...</p>
      </div>
    </div>
  )
}

export function Router() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <RouterProvider router={RenderRouter} />
    </Suspense>
  )
}

export default Router
 
