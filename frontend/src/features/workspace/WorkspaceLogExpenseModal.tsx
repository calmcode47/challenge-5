import { useRef, useState, type ReactElement, type SyntheticEvent } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useDialogAccessibility } from "../../components/common/useDialogAccessibility.js";
import { useUiStore } from "../../state/uiStore.js";

/** Props for WorkspaceLogExpenseModal. */
export interface WorkspaceLogExpenseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly categories?: readonly string[];
  readonly onRecordExpense?: (expense: ExpenseDraft) => void;
}

export interface ExpenseDraft {
  readonly category: string;
  readonly amount: number;
  readonly vendor: string;
}

interface FormFieldsProps {
  category: string;
  setCategory: (v: string) => void;
  categories: readonly string[];
  amount: string;
  setAmount: (v: string) => void;
  vendor: string;
  setVendor: (v: string) => void;
}

function CategorySelectField({
  category,
  setCategory,
  categories,
}: {
  category: string;
  setCategory: (v: string) => void;
  categories: readonly string[];
}): ReactElement {
  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor="expense-category"
        className="font-label-sm text-label-sm text-wine-deep font-bold uppercase"
      >
        Pillar Category
      </label>
      <select
        id="expense-category"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
        }}
        className="w-full px-space-md py-space-xs rounded-xl bg-cream-surface text-wine-deep font-body-md text-body-md shadow-inner outline-none focus:ring-2 focus:ring-wine-accent/30"
      >
        {categories.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function ExpenseFormFields({
  category,
  setCategory,
  categories,
  amount,
  setAmount,
  vendor,
  setVendor,
}: FormFieldsProps): ReactElement {
  return (
    <>
      <CategorySelectField category={category} setCategory={setCategory} categories={categories} />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="expense-amount"
          className="font-label-sm text-label-sm text-wine-deep font-bold uppercase"
        >
          Amount ($ USD)
        </label>
        <input
          id="expense-amount"
          type="number"
          min="0.01"
          step="0.01"
          inputMode="decimal"
          required
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
          }}
          className="w-full px-space-md py-space-xs rounded-xl bg-cream-surface text-wine-deep font-body-md text-body-md shadow-inner outline-none focus:ring-2 focus:ring-wine-accent/30"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label
          htmlFor="expense-vendor"
          className="font-label-sm text-label-sm text-wine-deep font-bold uppercase"
        >
          Artisan / Vendor
        </label>
        <input
          id="expense-vendor"
          type="text"
          required
          maxLength={120}
          value={vendor}
          onChange={(e) => {
            setVendor(e.target.value);
          }}
          className="w-full px-space-md py-space-xs rounded-xl bg-cream-surface text-wine-deep font-body-md text-body-md shadow-inner outline-none focus:ring-2 focus:ring-wine-accent/30"
        />
      </div>
    </>
  );
}

function LogExpenseForm({
  categories,
  onClose,
  onRecordExpense,
}: {
  categories: readonly string[];
  onClose: () => void;
  onRecordExpense?: (expense: ExpenseDraft) => void;
}): ReactElement {
  const { showNotification } = useUiStore();
  const [category, setCategory] = useState(categories[0] ?? "General");
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || !vendor.trim()) return;
    onRecordExpense?.({ category, amount: numericAmount, vendor: vendor.trim() });
    showNotification(
      `Recorded $${numericAmount.toFixed(2)} to ${category} (${vendor.trim()}).`,
      "success"
    );
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
      <ExpenseFormFields
        category={category}
        setCategory={setCategory}
        categories={categories}
        amount={amount}
        setAmount={setAmount}
        vendor={vendor}
        setVendor={setVendor}
      />
      <div className="flex justify-end gap-space-sm mt-space-sm">
        <button
          type="button"
          onClick={onClose}
          className="px-space-md py-space-xs rounded-xl text-text-muted hover:bg-cream-surface font-label-md text-label-md font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-space-lg py-space-xs rounded-xl bg-wine-accent text-cream-linen font-label-md text-label-md font-bold hover:bg-wine-deep shadow-sm"
        >
          Record In Escrow
        </button>
      </div>
    </form>
  );
}

/**
 * Modal dialog for recording an artisanal event expense into the ledger.
 */
export function WorkspaceLogExpenseModal({
  isOpen,
  onClose,
  categories = ["Venue & rentals", "Food & beverage", "Design & florals", "Contingency"],
  onRecordExpense,
}: WorkspaceLogExpenseModalProps): ReactElement | null {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  useDialogAccessibility(isOpen, onClose, dialogRef, closeButtonRef);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="expense-dialog-title"
      ref={dialogRef}
      tabIndex={-1}
    >
      <div className="w-full max-w-md bg-cream-linen rounded-3xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-wine-accent/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-wine-accent">
            <MaterialIcon name="payments" size={24} />
            <h2
              id="expense-dialog-title"
              className="font-headline-sm text-headline-sm text-wine-deep font-bold"
            >
              Log Ceramic Expense
            </h2>
          </div>
          <button
            type="button"
            ref={closeButtonRef}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/40"
            aria-label="Close dialog"
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>
        <LogExpenseForm
          categories={categories}
          onClose={onClose}
          onRecordExpense={onRecordExpense}
        />
      </div>
    </div>
  );
}
