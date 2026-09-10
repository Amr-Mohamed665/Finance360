import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  fetchCategories,
  deleteCategory,
} from "../store/slices/categoriesSlice";

import { fetchTransactions } from "../store/slices/transactionsSlice";

import CategoryCard from "../components/features/categories/CategoryCard";
import CategoryForm from "../components/features/categories/CategoryForm";

import SearchInput from "../components/common/SearchInput";
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

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());

    if (user?.id) {
      dispatch(fetchTransactions(user.id));
    }
  }, [dispatch, user?.id]);

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
      result = result.filter(
        (category) => category.type === activeTab || category.type === "both",
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase().trim();

      result = result.filter((category) =>
        category.name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [categories, activeTab, search]);

  const handleAddCategory = useCallback(() => {
    setEditingCategory(null);
    setModalOpen(true);
  }, []);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setModalOpen(true);
  }, []);

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

      await dispatch(deleteCategory(categoryId)).unwrap();
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

  const tabs = [
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
  ];

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="glass-panel rounded-xl p-2 border border-border/30">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search categories..."
          accent="warning"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex rounded-xl overflow-hidden border border-border bg-bg-tertiary/40 p-1 gap-1 w-full sm:w-auto">
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={[
                "px-4 py-2 rounded-lg",
                "text-xs font-semibold",
                "transition-all duration-200",
                "flex-1 sm:flex-initial",
                activeTab === key
                  ? "bg-warning text-white shadow-sm shadow-warning/20"
                  : "text-text-muted hover:text-warning hover:bg-warning/5",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        {categories.length > 0 && (
          <Button variant="primary" onClick={handleAddCategory}>
            <i className="fa-solid fa-plus mr-2" />
            Add Category
          </Button>
        )}
      </div>

      {filteredCategories.length === 0 ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <div className="flex flex-col items-center text-center">
            <EmptyState
              icon={
                <i className="fa-solid fa-layer-group text-warning text-2xl" />
              }
              title="No categories found"
              message={
                categories.length === 0
                  ? "Create your first category to organize your finances."
                  : "No categories match your search or filter."
              }
            />

            {categories.length === 0 && (
              <Button variant="primary" onClick={handleAddCategory}>
                <i className="fa-solid fa-plus mr-2" />
                Add Category
              </Button>
            )}
          </div>
        </div>
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
