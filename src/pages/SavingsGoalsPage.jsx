import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSavingsGoals, deleteSavingsGoal } from '../store/slices/savingsGoalsSlice';
import SavingsGoalCard from '../components/savings/SavingsGoalCard';
import SavingsGoalForm from '../components/savings/SavingsGoalForm';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function SavingsGoalsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const { items: savingsGoals, loading, error } = useSelector((s) => s.savingsGoals);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  useEffect(() => {
    if (user) dispatch(fetchSavingsGoals(user.id));
  }, [dispatch, user]);

  const handleEdit       = (goal) => { setEditingGoal(goal); setModalOpen(true); };
  const handleDelete     = (id)   => { if (window.confirm('Delete this savings goal?')) dispatch(deleteSavingsGoal(id)); };
  const handleCloseModal = ()     => { setModalOpen(false); setEditingGoal(null); };

  if (loading) return <Loading message="Loading savings goals..." />;
  if (error)   return <ErrorState message={error} onRetry={() => dispatch(fetchSavingsGoals(user.id))} />;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Savings Goals</h1>
          <p className="page-subtitle">Plan, track, and achieve your financial targets</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          <i className="fa-solid fa-plus" /> Add Goal
        </Button>
      </div>

      {savingsGoals.length === 0 ? (
        <EmptyState
          icon={<i className="fa-solid fa-piggy-bank text-accent-secondary text-2xl" />}
          title="No savings goals yet"
          message="Create a savings goal to start tracking your milestones."
          actionLabel="Create Goal"
          onAction={() => setModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {savingsGoals.map((goal) => (
            <SavingsGoalCard
              key={goal.id}
              goal={goal}
              onEdit={() => handleEdit(goal)}
              onDelete={() => handleDelete(goal.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingGoal ? 'Edit Savings Goal' : 'Create Savings Goal'}>
        <SavingsGoalForm goal={editingGoal} userId={user?.id} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
