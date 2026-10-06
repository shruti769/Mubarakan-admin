import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'

export default function useAdmin() {
  return useContext(AdminContext)
}
