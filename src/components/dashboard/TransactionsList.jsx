// src/components/dashboard/TransactionsList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import TransactionItem from './TransactionItem';
import './TransactionsList.css';
import DeleteConfirmationModal from './DeleteConfirmationModal';

import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from '../../store/api/transactionsApi';
import { toast } from 'react-toastify';
import { RiPencilFill } from 'react-icons/ri';
import { formatDate } from '../../utils/dateUtils';
import { formatCurrency } from '../../utils/formatUtils';

const TransactionsList = ({ onEdit, categoryMap, isLoadingCategories }) => {
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    isError: isErrorTransactions,
    error: errorTransactions,
  } = useGetTransactionsQuery();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();
  const [selectedTransactionId, setSelectedTransactionId] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionIdToDelete, setTransactionIdToDelete] = useState(null);

  const sortedTransactions = useMemo(() => {
    if (!transactions) return [];
    const list = [...transactions];
    return list.reverse();
  }, [transactions]);

  useEffect(() => {
    if (!sortedTransactions || sortedTransactions.length === 0) {
      setSelectedTransactionId(null);
      return;
    }
    const latestTransactionId = sortedTransactions[0].id;
    if (selectedTransactionId !== latestTransactionId) {
      setSelectedTransactionId(latestTransactionId);
    }
  }, [sortedTransactions]);

  const handleDeleteConfirm = async () => {
    if (isDeleting || !transactionIdToDelete) return;

    try {
      await deleteTransaction(transactionIdToDelete).unwrap();
      toast.success('Transaction deleted successfully!');
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      toast.error(err.data?.message || 'Could not delete transaction.');
    }

    setIsDeleteModalOpen(false);
    setTransactionIdToDelete(null);
  };

  const handleDeleteRequest = (id) => {
    setTransactionIdToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setTransactionIdToDelete(null);
  };

  if (isLoadingTransactions || isLoadingCategories) {
    return (
      <div className="transactions-list-container">
        <p className="no-transactions-message">Loading data...</p>
      </div>
    );
  }
  
  if (isErrorTransactions) {
    console.error('Error fetching transactions:', errorTransactions);
    return (
      <div className="transactions-list-container">
        <p className="no-transactions-message error-message">
          Failed to load transactions. Please try again.
        </p>
      </div>
    );
  }
  
  if (!sortedTransactions || sortedTransactions.length === 0) {
    return (
      <div className="transactions-list-container">
        <p className="no-transactions-message">No transactions found yet.</p>
      </div>
    );
  }

  return (
    <div className="transactions-list-container">
      <div className="mobile-transaction-list">
        {sortedTransactions.map((transaction) => (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={handleDeleteRequest}
            isActive={selectedTransactionId === transaction.id}
            onSelect={() => setSelectedTransactionId(transaction.id)}
            categoryMap={categoryMap}
          />
        ))}
      </div>

      <div className="desktop-transactions-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Category</th>
              <th>Comment</th>
              <th>Sum</th>
              <th> </th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => {
              const isExpense = transaction.type === 'EXPENSE';
              const sumClass = isExpense
                ? 'table-sum-expense'
                : 'table-sum-income';
              const categoryName =
                categoryMap[transaction.categoryId] || 'N/A';

              return (
                <tr key={transaction.id}>
                  <td>{formatDate(transaction.transactionDate)}</td>
                  <td className="table-type">{isExpense ? '-' : '+'}</td>
                  <td>{categoryName}</td>
                  <td className="table-comment">{transaction.comment}</td>
                  <td className={sumClass}>
                    {formatCurrency(Math.abs(transaction.amount))}
                  </td>
                  <td className="table-actions">
                    <button
                      className="table-edit-btn"
                      onClick={() => onEdit(transaction)}
                    >
                      <RiPencilFill />
                    </button>
                    <button
                      className="table-delete-btn"
                      onClick={() => handleDeleteRequest(transaction.id)}
                      disabled={isDeleting}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default TransactionsList;