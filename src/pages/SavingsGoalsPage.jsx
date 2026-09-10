import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchSavingsGoals,
  deleteSavingsGoal,
} from "../store/slices/savingsGoalsSlice";
import SavingsGoalCard from "../components/features/savings/SavingsGoalCard";
import SavingsGoalForm from "../components/features/savings/SavingsGoalForm";
import Modal from "../components/common/Modal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function SavingsGoalsPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);

  const {
    items: savingsGoals,
    loading,
    error,
  } = useSelector((s) => s.savingsGoals);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSavingsGoals(user.id));
    }
  }, [dispatch, user]);

  const handleAdd = () => {
    setEditingGoal(null);
    setModalOpen(true);
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setModalOpen(true);
  };

  // بدل window.confirm - بنفتح مودال التأكيد
  const handleDelete = (goal) => {
    setDeleteTarget(goal);
  };

  const handleCancelDelete = () => {
    if (deleting) return;
    setDeleteTarget(null);
  };

  const handleConfirmDelete = async () => {
    // Strapi 5 REST API uses documentId for document operations.
    const documentId = deleteTarget?.documentId || deleteTarget?.id;

    if (!documentId) {
      console.error("Cannot delete savings goal: missing ID");
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      await dispatch(deleteSavingsGoal(documentId)).unwrap?.();
    } catch (err) {
      console.error("Failed to delete savings goal:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingGoal(null);
  };

  if (loading) {
    return <Loading message="Loading savings goals..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={() => {
          if (user?.id) {
            dispatch(fetchSavingsGoals(user.id));
          }
        }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Top Action Bar */}
      <div className="flex items-center justify-end">
        <Button variant="primary" onClick={handleAdd}>
          <i className="fa-solid fa-plus mr-2" />
          Add Goal
        </Button>
      </div>

      {savingsGoals.length === 0 ? (
        <EmptyState
          icon={
            <i className="fa-solid fa-piggy-bank text-accent-secondary text-2xl" />
          }
          title="No savings goals yet"
          message="Create a savings goal to start tracking your milestones."
          actionLabel="Create Goal"
          onAction={handleAdd}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.documentId || goal.id}
              goal={goal}
              onEdit={() => handleEdit(goal)}
              onDelete={() => handleDelete(goal)}
            />
          ))}
        </div>
      )}

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
