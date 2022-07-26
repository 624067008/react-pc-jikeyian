import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

export default function AuthComponent({ children }) {
  const isToken = getToken()

  if (isToken) {
    return <>{children}</>
  }

  return <Navigate to='/login' replace />
} 