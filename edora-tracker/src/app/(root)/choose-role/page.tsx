import React, { Suspense } from "react"
// import { ChooseRoleHero } from "./_components/choose-role-hero"
import  {RoleSelector}  from "./_components/role-selector"

export default function ChooseRolePage() {
  return (
    <main className="min-h-screen">
      {/* <ChooseRoleHero /> */}
      <Suspense fallback={null}>
        <RoleSelector />
      </Suspense>
    </main>
  )
}