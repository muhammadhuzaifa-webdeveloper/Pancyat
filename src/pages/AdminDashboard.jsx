import { useState } from 'react'
import Navbar from '../components/shared/Navbar.jsx'
import Sidebar from '../components/admin/Sidebar.jsx'
import DashboardStats from '../components/admin/DashboardStats.jsx'
import ProductManagement from '../components/admin/ProductManagement.jsx'
import CategoryManagement from '../components/admin/CategoryManagement.jsx'
import OrdersOverview from '../components/admin/OrdersOverview.jsx'
import UserManagement from '../components/admin/UserManagement.jsx'

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')

  return (
    <div className="flex h-screen flex-col bg-paper">
      <Navbar title="Admin Dashboard" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar active={tab} onChange={setTab} />
        <main className="flex-1 overflow-y-auto p-6">
          {tab === 'overview' && <DashboardStats />}
          {tab === 'products' && <ProductManagement />}
          {tab === 'categories' && <CategoryManagement />}
          {tab === 'orders' && <OrdersOverview />}
          {tab === 'users' && <UserManagement />}
        </main>
      </div>
    </div>
  )
}
