import { useState, type ReactElement, type SyntheticEvent } from "react";
import { MaterialIcon } from "../../components/common/MaterialIcon.js";
import { useUiStore } from "../../state/uiStore.js";

/** Props for WorkspaceLogExpenseModal. */
export interface WorkspaceLogExpenseModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
}

interface FormFieldsProps {
  category: string;
  setCategory: (v: string) => void;
  amount: string;
  setAmount: (v: string) => void;
  vendor: string;
  setVendor: (v: string) => void;
}

function CategorySelectField({
  category,
  setCategory,
}: {
  category: string;
  setCategory: (v: string) => void;
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
        <option value="Venue & Dining">Venue &amp; Dining</option>
        <option value="Photo & Film">Photo &amp; Film</option>
        <option value="Flora & Decor">Flora &amp; Decor</option>
        <option value="Acoustic & Folk">Acoustic &amp; Folk</option>
        <option value="Awning Shield">Awning Shield</option>
        <option value="Clay Stationery">Clay Stationery</option>
      </select>
    </div>
  );
}

function ExpenseFormFields({
  category,
  setCategory,
  amount,
  setAmount,
  vendor,
  setVendor,
}: FormFieldsProps): ReactElement {
  return (
    <>
      <CategorySelectField category={category} setCategory={setCategory} />

      <div className="flex flex-col gap-1">
        <label
          htmlFor="expense-amount"
          className="font-label-sm text-label-sm text-wine-deep font-bold uppercase"
        >
          Amount ($ USD)
        </label>
        <input
          id="expense-amount"
          type="text"
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

function LogExpenseForm({ onClose }: { onClose: () => void }): ReactElement {
  const { showNotification } = useUiStore();
  const [category, setCategory] = useState("Venue & Dining");
  const [amount, setAmount] = useState("350.00");
  const [vendor, setVendor] = useState("Orchard Slipware Kiln");

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    showNotification(`Recorded $${amount} to ${category} (${vendor}).`, "success");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
      <ExpenseFormFields
        category={category}
        setCategory={setCategory}
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
}: WorkspaceLogExpenseModalProps): ReactElement | null {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-wine-deep/40 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Log Ceramic Expense"
    >
      <div className="w-full max-w-md bg-cream-linen rounded-3xl shadow-2xl p-space-lg flex flex-col gap-space-md border border-wine-accent/15">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-xs text-wine-accent">
            <MaterialIcon name="payments" size={24} />
            <h3 className="font-headline-sm text-headline-sm text-wine-deep font-bold">
              Log Ceramic Expense
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-cream-surface flex items-center justify-center text-wine-deep hover:bg-blush-petal/40"
            aria-label="Close dialog"
          >
            <MaterialIcon name="close" size={18} />
          </button>
        </div>
        <LogExpenseForm onClose={onClose} />
      </div>
    </div>
  );
}
