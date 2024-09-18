import { ClerkProvider } from '@clerk/nextjs'
import React from 'react'
import {dark} from "@clerk/themes"

export const ClerkClientProvider = ({children} : {children : React.ReactNode}) => {
  return (
    <ClerkProvider
      appearance={{
        baseTheme : dark,
        variables : {
          colorPrimary : "#3371ff",
          fontSize : '16px'
        }
      }}
    >
      {children}
    </ClerkProvider>
  )
}
