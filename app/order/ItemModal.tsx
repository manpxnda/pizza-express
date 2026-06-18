"use client";

import { useMemo, useState } from "react";
import {
  groupLabel,
  money,
  type ModifierGroup,
  type Product,
} from "../lib/menu";
import { useCart, type SelectedModifier } from "./CartContext";

function isSingleSelect(g: ModifierGroup): boolean {
  return g.max === 1;
}

export default function ItemModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addLine } = useCart();
  const [sizeIndex, setSizeIndex] = useState(product.defaultSizeIndex);
  const [selected, setSelected] = useState<Record<number, number[]>>({});
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [showErrors, setShowErrors] = useState(false);

  const hasSizes = product.sizes.length > 1;
  const size = product.sizes[sizeIndex];
  const item = size.item;

  const changeSize = (i: number) => {
    setSizeIndex(i);
    setSelected({}); // toppings/prices differ per size
    setShowErrors(false);
  };

  const toggle = (g: ModifierGroup, optionId: number) => {
    setSelected((prev) => {
      const cur = prev[g.id] ?? [];
      if (isSingleSelect(g)) return { ...prev, [g.id]: [optionId] };
      if (cur.includes(optionId))
        return { ...prev, [g.id]: cur.filter((id) => id !== optionId) };
      if (g.max > 0 && cur.length >= g.max) return prev;
      return { ...prev, [g.id]: [...cur, optionId] };
    });
  };

  const selectedModifiers: SelectedModifier[] = useMemo(() => {
    const out: SelectedModifier[] = [];
    for (const g of item.modifierGroups) {
      for (const id of selected[g.id] ?? []) {
        const opt = g.options.find((o) => o.id === id);
        if (opt)
          out.push({
            groupId: g.id,
            groupName: groupLabel(g),
            optionId: opt.id,
            name: opt.name,
            price: opt.price,
          });
      }
    }
    return out;
  }, [selected, item.modifierGroups]);

  const unitPrice = item.price + selectedModifiers.reduce((s, m) => s + m.price, 0);
  const total = unitPrice * qty;

  const unmetGroups = item.modifierGroups.filter(
    (g) => g.min > 0 && (selected[g.id]?.length ?? 0) < g.min
  );

  const handleAdd = () => {
    if (unmetGroups.length > 0) {
      setShowErrors(true);
      return;
    }
    addLine({
      uid: `${item.id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      itemId: item.id,
      name: hasSizes ? `${product.name} (${size.label})` : product.name,
      basePrice: item.price,
      qty,
      modifiers: selectedModifiers,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-charcoal/50 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-white shadow-lift sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-charcoal/10 p-5">
          <div>
            <h2 className="font-display text-xl font-extrabold text-charcoal">
              {product.name}
            </h2>
            {product.desc && (
              <p className="mt-1 text-sm text-charcoal/60">{product.desc}</p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="-mr-1 -mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal/50 hover:bg-cream-deep"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Size selector */}
          {hasSizes && (
            <fieldset className="mb-6">
              <legend className="mb-2 font-display text-sm font-bold text-charcoal">
                Choose a size
              </legend>
              <div className="grid gap-1.5">
                {product.sizes.map((s, i) => {
                  const sel = i === sizeIndex;
                  return (
                    <label
                      key={s.item.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                        sel ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/12 hover:border-charcoal/25"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                            sel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"
                          }`}
                        >
                          {sel && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span>
                          <span className="font-semibold text-charcoal">{s.label}</span>
                          {s.sublabel && (
                            <span className="ml-2 text-xs text-charcoal/50">{s.sublabel}</span>
                          )}
                        </span>
                      </span>
                      <span className="shrink-0 font-display font-bold text-charcoal">
                        {money(s.item.price)}
                      </span>
                      <input
                        type="radio"
                        name="size"
                        checked={sel}
                        onChange={() => changeSize(i)}
                        className="sr-only"
                      />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {item.modifierGroups.map((g) => {
            const ids = selected[g.id] ?? [];
            const unmet = showErrors && g.min > 0 && ids.length < g.min;
            return (
              <fieldset key={g.id} className="mb-6 last:mb-0">
                <legend className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-charcoal">
                  {groupLabel(g)}
                  {g.min > 0 ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                        unmet ? "bg-pizza-red/15 text-pizza-red" : "bg-pizza-green/12 text-pizza-green-dark"
                      }`}
                    >
                      Required
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-charcoal/40">
                      Optional{g.max > 1 ? ` · up to ${g.max}` : ""}
                    </span>
                  )}
                </legend>

                <div className="grid gap-1.5">
                  {g.options.map((o) => {
                    const isSel = ids.includes(o.id);
                    return (
                      <label
                        key={o.id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                          isSel ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/12 hover:border-charcoal/25"
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${
                              isSingleSelect(g) ? "rounded-full" : "rounded-md"
                            } ${isSel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"}`}
                          >
                            {isSel && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                          <span className="font-medium text-charcoal">{o.name}</span>
                        </span>
                        {o.price > 0 && (
                          <span className="shrink-0 text-sm font-semibold text-charcoal/60">
                            +{money(o.price)}
                          </span>
                        )}
                        <input
                          type={isSingleSelect(g) ? "radio" : "checkbox"}
                          name={`group-${g.id}`}
                          checked={isSel}
                          onChange={() => toggle(g, o.id)}
                          className="sr-only"
                        />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          {/* Special instructions */}
          <div className="mt-2">
            <label className="mb-2 block font-display text-sm font-bold text-charcoal">
              Special instructions
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="e.g. well done, cut in squares, light sauce…"
              className="w-full resize-none rounded-xl border border-charcoal/15 px-3.5 py-2.5 text-sm outline-none focus:border-pizza-red"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-charcoal/10 p-4">
          {showErrors && unmetGroups.length > 0 && (
            <p className="mb-3 text-center text-sm font-semibold text-pizza-red">
              Please choose: {unmetGroups.map((g) => groupLabel(g)).join(", ")}
            </p>
          )}
          <div className="flex items-center gap-3">
            <div className="flex items-center rounded-full border border-charcoal/15">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-11 w-11 items-center justify-center text-xl font-bold text-charcoal/70 hover:text-pizza-red"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-7 text-center font-display text-lg font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="flex h-11 w-11 items-center justify-center text-xl font-bold text-charcoal/70 hover:text-pizza-red"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between rounded-full bg-pizza-red px-6 py-3.5 font-bold text-white shadow-card transition-colors hover:bg-pizza-red-dark"
            >
              <span>Add to order</span>
              <span>{money(total)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
