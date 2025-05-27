import OperationLayout from '@/Layouts/OperationLayout'
import ResponsableLayout from '@/Layouts/ResponsableLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const DashboardOperation = () => {
  return (
    <OperationLayout header="Tableau de bord">
        <Head title="Tableau de bord" />
    </OperationLayout>
  )
}

export default DashboardOperation