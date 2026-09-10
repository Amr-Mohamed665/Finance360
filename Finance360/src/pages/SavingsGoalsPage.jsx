import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus, FiSearch, FiTarget } from "react-icons/fi";

import {
  fetchSavingsGoals,
  deleteSavingsGoal,
} from "../store/slices/savingsGoalsSlice";

import SavingsGoalCard from "../components/features/savings/SavingsGoalCard";
import SavingsGoalForm from "../components/features/savings/SavingsGoalForm";

import Modal from "../components/common/Modal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import Button from "../components/common/Button";
import SearchInput from "../components/common/SearchInput";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function SavingsGoalsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const {
    items: savingsGoals = [],
    loading,
    error,
  } = useSelector((state) => state.savingsGoals);

  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    dispatch(fetchSavingsGoals(user.id));
  }, [dispatch, user?.id]);

  const filteredGoals = useMemo(() => {
    if (!Array.isArray(savingsGoals)) {
      return [];
    }

    if (!search.trim()) {
      return savingsGoals;
    }

    const query = search.trim().toLowerCase();

    return savingsGoals.filter((goal) =>
      String(goal?.name || "")
        .toLowerCase()
        .includes(query),
    );
  }, [savingsGoals, search]);

  const handleAdd = useCallback(() => {
    setEditingGoal(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  }, []);

  const handleDelete = useCallback((goal) => {
    setDeleteTarget(goal);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleting) return;

    setDeleteTarget(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    const goalId = deleteTarget?.documentId || deleteTarget?.id;

    if (!goalId) {
      console.error("Cannot delete savings goal: missing ID");

      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);

      await dispatch(deleteSavingsGoal(goalId)).unwrap();
    } catch (error) {
      console.error("Failed to delete savings goal:", error);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingGoal(null);
  }, []);

  const handleRetry = useCallback(() => {
    if (!user?.id) return;

    dispatch(fetchSavingsGoals(user.id));
  }, [dispatch, user?.id]);

  if (loading) {
    return <Loading message="Loading savings goals..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  const hasGoals = savingsGoals.length > 0;
  const hasSearchResults = filteredGoals.length > 0;

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      {/* Controls */}
      <div className="glass-panel rounded-xl p-3 border border-border/30">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search savings goals..."
              accent="secondary"
            />
          </div>

          <Button variant="primary" onClick={handleAdd}>
            <FiPlus className="w-4 h-4" />
            Add Goal
          </Button>
        </div>
      </div>

      {/* Goals */}
      {!hasGoals ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={<FiTarget className="text-accent-secondary text-2xl" />}
              title="No savings goals yet"
              message="Create a savings goal to start tracking your milestones."
              actionLabel="Create Goal"
              onAction={handleAdd}
            />
          </div>
        </div>
      ) : !hasSearchResults ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={<FiSearch className="text-accent-secondary text-2xl" />}
              title="No goals found"
              message={`No savings goals match "${search}".`}
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.documentId || goal.id}
              goal={goal}
              onEdit={() => handleEdit(goal)}
              onDelete={() => handleDelete(goal)}
            />
          ))}
        </div>
      )}

      {/* Savings Goal Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? "Edit Savings Goal" : "Create Savings Goal"}
      >
        <SavingsGoalForm
          goal={editingGoal}
          userId={user?.id}
          onClose={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete Savings Goal"
        message="Are you sure you want to delete this savings goal?"
        itemName={deleteTarget?.name || deleteTarget?.title}
      />
    </div>
  );
}
