import AppForm from '@/components/core/AppDiaglogForm'
import { AuthTypes } from '@/enum/auth'
import React from 'react'

const LogoutPage = () => {
  const handleLogout = () => {
    console.log("User logged out")
    
  }

  return (
    <AppForm
      triggerText={AuthTypes.LOGIN}
      title={AuthTypes.LOGOUT_TITLE}
      description={AuthTypes.LOGOUT_DES}
      fields={[]}
      onSubmit={handleLogout}
    />
  )
}

export default LogoutPage
