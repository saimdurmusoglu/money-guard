// src/pages/DashboardPage.jsx
import React, { useState, useMemo } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import MobileNavButtons from '../components/common/MobileNavButtons';
import Navigation from '../components/common/Navigation';
import Balance from '../components/dashboard/Balance';
import CurrencyView from '../components/dashboard/CurrencyView';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';
import EditTransactionModal from '../components/dashboard/EditTransactionModal';

import {
  useGetTransactionCategoriesQuery,
  useGetBalanceQuery,
} from '../store/api/transactionsApi';

import './DashboardPage.css';

const DashboardPage = () => {
  const { data: balanceData, isLoading: isBalanceLoading } = useGetBalanceQuery();
  const currentBalance = balanceData?.balance;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const handleOpenEditModal = (transactionData) => {
    setSelectedTransaction(transactionData);
    setIsEditModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const { data: categoriesData, isLoading: isLoadingCategories } = useGetTransactionCategoriesQuery();
  const categoriesMap = useMemo(() => {
    if (!categoriesData) return {};
    return categoriesData.reduce((map, category) => {
      map[category.id] = category.name;
      return map;
    }, {});
  }, [categoriesData]);

  const location = useLocation();
  const currentPathEnd = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);


  return (
    <div className="dashboard-page-layout">
      <Header />
      <div className="dashboard-container">
        {isAddModalOpen && <AddTransactionModal onClose={closeAddModal} />}
        {isEditModalOpen && (
          <EditTransactionModal
            transactionToEdit={selectedTransaction}
            onClose={handleCloseEditModal}
            categoryMap={categoriesMap}
          />
        )}
        <div className="dashboard-main-content">
          <aside className="dashboard-sidebar">
            <nav className="desktop-nav-container">
              <Navigation />
            </nav>
            <div className="sidebar-balance-container">
              <Balance amount={currentBalance} isLoading={isBalanceLoading} />
            </div>
          </aside>

          <div className="dashboard-currency-area">
            <CurrencyView />
          </div>

          <nav className="mobile-nav-container">
            <MobileNavButtons
               activePath={currentPathEnd || 'home'}
            />
          </nav>

          <main className="dashboard-content-area">
            <Outlet context={{
              openAddModal,
              handleOpenEditModal,
              categoriesMap,
              isLoadingCategories,
              currentBalance,
              isBalanceLoading
            }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;