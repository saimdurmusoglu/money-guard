// src/components/dashboard/HomeView.jsx
import React from "react";
import { useOutletContext } from 'react-router-dom';
import Balance from "./Balance";
import TransactionsList from "./TransactionsList";
import ButtonAddTransaction from "./ButtonAddTransaction";
import "./HomeView.css";

const HomeView = () => {
  const {
    openAddModal,
    handleOpenEditModal,
    categoriesMap,
    isLoadingCategories,
    currentBalance,
    isBalanceLoading
  } = useOutletContext();

  return (
    <div className="home-view-container">
      <Balance amount={currentBalance} isLoading={isBalanceLoading} />

      <TransactionsList
        onEdit={handleOpenEditModal}
        categoryMap={categoriesMap}
        isLoadingCategories={isLoadingCategories}
      />

      <ButtonAddTransaction onClick={openAddModal} />
    </div>
  );
};

export default HomeView;