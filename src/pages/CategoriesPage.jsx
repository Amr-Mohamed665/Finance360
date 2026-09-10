import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCategories,
  deleteCategory,
} from "../store/slices/categoriesSlice";
import { fetchTransactions } from "../store/slices/transactionsSlice";
import CategoryCard from "../components/features/categories/CategoryCard";
import CategoryForm from "../components/features/categories/CategoryForm";
import Modal from "../components/common/Modal";
import DeleteConfirmModal from "../components/common/DeleteConfirmModal";
import Button from "../components/common/Button";
import Loading from "../components/common/Loading";
import ErrorState from "../components/common/ErrorState";
import EmptyState from "../components/common/EmptyState";

export default function CategoriesPage() {
  const dispatch = useDispatch();

  const { user } = useSelector((s) => s.auth);

  const {
    items: categories,
    loading,
    error,
  } = useSelector((s) => s.categories);

  const { items: transactions } = useSelector((s) => s.transactions);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());

    if (user?.id) {
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user]);

  // Transaction count per category
  const txCountMap = useMemo(() => {
    const map = {};

    if (Array.isArray(transactions)) {
      transactions.forEach((tx) => {
        const catKey = String(
          tx.category?.documentId ||
            tx.category?.id ||
            tx.categoryId ||
            tx.category ||
            "",
        );

        if (catKey) {
          map[catKey] = (map[catKey] || 0) + 1;
        }
      });
    }

    return map;
  }, [transactions]);

  const filteredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];

    let result = [...categories];

    if (activeTab !== "all") {
      result = result.filter((c) => c.type === activeTab || c.type === "both");
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter((c) => c.name?.toLowerCase().includes(q));
    }

    return result;
  }, [categories, activeTab, search]);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setModalOpen(true);
  }, []);

  // بدل window.confirm - بنفتح مودال التأكيد
  const handleDelete = useCallback((category) => {
    setDeleteTarget(category);
  }, []);

  const handleCancelDelete = useCallback(() => {
    if (deleting) return;
    setDeleteTarget(null);
  }, [deleting]);

  const handleConfirmDelete = useCallback(async () => {
    const categoryId = deleteTarget?.documentId || deleteTarget?.id;

    if (!categoryId) {
      console.error("Cannot delete category: missing ID");
      setDeleteTarget(null);
      return;
    }

    try {
      setDeleting(true);
      await dispatch(deleteCategory(categoryId)).unwrap?.();
    } catch (err) {
      console.error("Failed to delete category:", err);
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, dispatch]);

  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
    setEditingCategory(null);
  }, []);

  if (loading && (!categories || categories.length === 0)) {
    return <Loading message="Loading categories..." />;
  }

  if (error && (!categories || categories.length === 0)) {
    return (
      <ErrorState message={error} onRetry={() => dispatch(fetchCategories())} />
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Toolbar / Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Type Tabs */}
        <div className="flex rounded-lg overflow-hidden border border-border bg-bg-tertiary/40 p-1 gap-1 w-full sm:w-auto">
          {[
            {
              key: "all",
              label: "All Categories",
            },
            {
              key: "expense",
              label: "Expenses",
            },
            {
              key: "income",
              label: "Income",
            },
          ].map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={[
                "px-4 py-2 rounded-md text-xs font-semibold transition-all duration-150 flex-1 sm:flex-initial",
                activeTab === key
                  ? "bg-gradient-primary text-white shadow-sm"
                  : "text-text-muted hover:text-text-secondary",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search & Add Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-xs pointer-events-none">
              <i className="fa-solid fa-magnifying-glass" />
            </span>

            <input
              type="text"
              className="w-full bg-bg-tertiary/60 border border-border rounded-lg pl-8 pr-8 py-2 text-xs text-text-primary placeholder-text-muted outline-none transition-all duration-150 focus:border-accent-primary/50 backdrop-blur-sm"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                type="button"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary text-xs"
                onClick={() => setSearch("")}
              >
                <i className="fa-solid fa-xmark" />
              </button>
            )}
          </div>

          <Button
            variant="primary"
            onClick={() => {
              setEditingCategory(null);
              setModalOpen(true);
            }}
          >
            <i className="fa-solid fa-plus" /> Add Category
          </Button>
        </div>
      </div>

      {/* Categories Grid */}
      {filteredCategories.length === 0 ? (
        <EmptyState
          icon={<i className="fa-solid fa-layer-group text-warning text-2xl" />}
          title="No categories found"
          message={
            categories.length === 0
              ? "Create your first category to organize your finances."
              : "No categories match your search or filter."
          }
          actionLabel={categories.length === 0 ? "Add Category" : undefined}
          onAction={
            categories.length === 0
              ? () => {
                  setEditingCategory(null);
                  setModalOpen(true);
                }
              : undefined
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((category) => {
            const categoryId = category.documentId || category.id;

            const catKey = String(categoryId);

            return (
              <CategoryCard
                key={catKey}
                category={category}
                transactionCount={txCountMap[catKey] || 0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? "Edit Category" : "Create New Category"}
      >
        <CategoryForm
          category={editingCategory}
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
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        itemName={deleteTarget?.name}
      />
    </div>
  );
}
