"use client";

import { useMemo, useState } from "react";
import {
  MEAL_UPSELLS,
  canonicalToppingGroup,
  groupLabel,
  money,
  type ModifierGroup,
  type ModifierOption,
  type Product,
} from "../lib/menu";
import { useCart, type SelectedModifier } from "./CartContext";

type Side = "left" | "whole" | "right";
type Amount = "lite" | "regular" | "double";
type TState = { side: Side; amount: Amount; included: boolean };

const SIDE_OPTS: { k: Side; l: string }[] = [
  { k: "left", l: "½ Left" },
  { k: "whole", l: "Whole" },
  { k: "right", l: "½ Right" },
];
const AMT_OPTS: { k: Amount; l: string }[] = [
  { k: "lite", l: "Lite" },
  { k: "regular", l: "Regular" },
  { k: "double", l: "Double" },
];

function toppingContribution(opt: ModifierOption, st: TState): number {
  const unit = st.side === "whole" ? opt.price : opt.halfPrice;
  if (st.included) return st.amount === "double" ? unit : 0;
  return st.amount === "double" ? unit * 2 : unit;
}

function toppingLabel(name: string, st: TState): string {
  const parts: string[] = [];
  if (st.side === "left") parts.push("Left ½");
  else if (st.side === "right") parts.push("Right ½");
  if (st.amount === "lite") parts.push("Lite");
  else if (st.amount === "double") parts.push("Double");
  return parts.length ? `${name} (${parts.join(", ")})` : name;
}

function Segmented<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { k: T; l: string }[];
}) {
  return (
    <div className="flex rounded-lg bg-cream-deep p-0.5">
      {options.map((o) => (
        <button
          key={o.k}
          type="button"
          onClick={() => onChange(o.k)}
          className={`flex-1 rounded-md px-1 py-1 text-xs font-bold transition-colors ${
            value === o.k ? "bg-white text-charcoal shadow-sm" : "text-charcoal/55 hover:text-charcoal"
          }`}
        >
          {o.l}
        </button>
      ))}
    </div>
  );
}

export default function ItemModal({
  product,
  isPizza,
  mealUpsell = false,
  onClose,
}: {
  product: Product;
  isPizza: boolean;
  mealUpsell?: boolean;
  onClose: () => void;
}) {
  const { addLine } = useCart();
  const [sizeIndex, setSizeIndex] = useState(product.defaultSizeIndex);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [mealAdds, setMealAdds] = useState<Set<number>>(new Set());

  const upsells = mealUpsell
    ? MEAL_UPSELLS.filter((u) => u.id !== product.sizes[0].item.id)
    : [];
  const toggleMeal = (id: number) =>
    setMealAdds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const hasSizes = product.sizes.length > 1;
  const size = product.sizes[sizeIndex];
  const item = size.item;

  const toppingGroup = isPizza ? canonicalToppingGroup(item) : undefined;

  const initToppings = (it: typeof item): Record<number, TState> => {
    const s: Record<number, TState> = {};
    for (const id of it.presets ?? [])
      s[id] = { side: "whole", amount: "regular", included: true };
    return s;
  };

  // Advanced per-topping state (pizzas only)
  const [toppings, setToppings] = useState<Record<number, TState>>(() =>
    initToppings(item)
  );
  // Simple selections for every other group (radio/checkbox)
  const [simple, setSimple] = useState<Record<number, number[]>>({});

  const presetIds = item.presets ?? [];

  const changeSize = (i: number) => {
    setSizeIndex(i);
    setToppings(initToppings(product.sizes[i].item));
    setSimple({});
    setShowErrors(false);
  };

  const toggleTopping = (o: ModifierOption) => {
    setToppings((prev) => {
      const next = { ...prev };
      if (next[o.id]) delete next[o.id];
      else next[o.id] = { side: "whole", amount: "regular", included: presetIds.includes(o.id) };
      return next;
    });
  };
  const setT = (id: number, patch: Partial<TState>) =>
    setToppings((prev) => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const toggleSimple = (g: ModifierGroup, optionId: number) => {
    setSimple((prev) => {
      const cur = prev[g.id] ?? [];
      if (g.max === 1) return { ...prev, [g.id]: [optionId] };
      if (cur.includes(optionId)) return { ...prev, [g.id]: cur.filter((x) => x !== optionId) };
      if (g.max > 0 && cur.length >= g.max) return prev;
      return { ...prev, [g.id]: [...cur, optionId] };
    });
  };

  // Groups rendered as simple lists (everything except the canonical topping
  // list and the redundant "Non Priced Toppings" list).
  const simpleGroups = item.modifierGroups.filter(
    (g) =>
      g.id !== toppingGroup?.id && !g.name.toLowerCase().includes("non priced")
  );

  const selectedModifiers: SelectedModifier[] = useMemo(() => {
    const out: SelectedModifier[] = [];
    if (toppingGroup) {
      for (const o of toppingGroup.options) {
        const st = toppings[o.id];
        if (!st) continue;
        out.push({
          groupId: toppingGroup.id,
          groupName: "Toppings",
          optionId: o.id,
          name: toppingLabel(o.name, st),
          price: toppingContribution(o, st),
        });
      }
      // Removed presets -> tell the kitchen to leave them off
      for (const id of presetIds) {
        if (!toppings[id]) {
          const o = toppingGroup.options.find((x) => x.id === id);
          if (o)
            out.push({
              groupId: toppingGroup.id,
              groupName: "Toppings",
              optionId: id,
              name: `No ${o.name}`,
              price: 0,
            });
        }
      }
    }
    for (const g of simpleGroups) {
      for (const id of simple[g.id] ?? []) {
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
  }, [toppings, simple, toppingGroup, simpleGroups, presetIds]);

  const unitPrice = item.price + selectedModifiers.reduce((s, m) => s + m.price, 0);
  const total = unitPrice * qty;
  const mealAddTotal = upsells
    .filter((u) => mealAdds.has(u.id))
    .reduce((s, u) => s + u.price, 0);
  const grandTotal = total + mealAddTotal;
  const addCount = qty + mealAdds.size;

  const unmetGroups = simpleGroups.filter(
    (g) => g.min > 0 && (simple[g.id]?.length ?? 0) < g.min
  );

  const newUid = (id: number) =>
    `${id}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const handleAdd = () => {
    if (unmetGroups.length > 0) {
      setShowErrors(true);
      return;
    }
    addLine({
      uid: newUid(item.id),
      itemId: item.id,
      name: hasSizes ? `${product.name} (${size.label})` : product.name,
      basePrice: item.price,
      qty,
      modifiers: selectedModifiers,
      notes: notes.trim() || undefined,
    });
    // "Make it a meal" add-ons become their own lines
    for (const u of upsells) {
      if (mealAdds.has(u.id))
        addLine({ uid: newUid(u.id), itemId: u.id, name: u.name, basePrice: u.price, qty: 1, modifiers: [] });
    }
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
            <h2 className="font-display text-xl font-extrabold text-charcoal">{product.name}</h2>
            {product.desc && <p className="mt-1 text-sm text-charcoal/60">{product.desc}</p>}
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
              <legend className="mb-2 font-display text-sm font-bold text-charcoal">Choose a size</legend>
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
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${sel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"}`}>
                          {sel && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span>
                          <span className="font-semibold text-charcoal">{s.label}</span>
                          {s.sublabel && <span className="ml-2 text-xs text-charcoal/50">{s.sublabel}</span>}
                        </span>
                      </span>
                      <span className="shrink-0 font-display font-bold text-charcoal">{money(s.item.price)}</span>
                      <input type="radio" name="size" checked={sel} onChange={() => changeSize(i)} className="sr-only" />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Advanced pizza toppings */}
          {toppingGroup && (
            <fieldset className="mb-6">
              <legend className="mb-1 font-display text-sm font-bold text-charcoal">
                {presetIds.length > 0 ? "Toppings — make it yours" : "Add Toppings"}
              </legend>
              <p className="mb-2.5 text-xs text-charcoal/55">
                {presetIds.length > 0
                  ? "Tap any topping to add or remove it, then set the side and how much."
                  : "Tap to add. Then choose whole or half, and how much."}
              </p>
              <div className="grid gap-1.5">
                {toppingGroup.options.map((o) => {
                  const st = toppings[o.id];
                  const sel = !!st;
                  const c = st ? toppingContribution(o, st) : 0;
                  return (
                    <div
                      key={o.id}
                      className={`rounded-xl border transition-colors ${
                        sel ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/12"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleTopping(o)}
                        className="flex w-full items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm"
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${sel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"}`}>
                            {sel && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                          <span className="font-medium text-charcoal">{o.name}</span>
                        </span>
                        <span className="shrink-0 text-sm font-semibold text-charcoal/60">
                          {sel
                            ? st!.included && c === 0
                              ? "Included"
                              : c > 0
                                ? `+${money(c)}`
                                : "Included"
                            : `+${money(o.price)}`}
                        </span>
                      </button>

                      {sel && (
                        <div className="grid gap-2 px-3.5 pb-3 pt-0.5 sm:grid-cols-2">
                          <Segmented
                            value={st!.side}
                            onChange={(v) => setT(o.id, { side: v })}
                            options={SIDE_OPTS}
                          />
                          <Segmented
                            value={st!.amount}
                            onChange={(v) => setT(o.id, { amount: v })}
                            options={AMT_OPTS}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Other groups (cooking instructions, sauces, dressings, sub toppings) */}
          {simpleGroups.map((g) => {
            const ids = simple[g.id] ?? [];
            const unmet = showErrors && g.min > 0 && ids.length < g.min;
            const isRadio = g.max === 1;
            return (
              <fieldset key={g.id} className="mb-6 last:mb-0">
                <legend className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-charcoal">
                  {groupLabel(g)}
                  {g.min > 0 ? (
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${unmet ? "bg-pizza-red/15 text-pizza-red" : "bg-pizza-green/12 text-pizza-green-dark"}`}>
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
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${isSel ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/12 hover:border-charcoal/25"}`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center border-2 ${isRadio ? "rounded-full" : "rounded-md"} ${isSel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"}`}>
                            {isSel && (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                          <span className="font-medium text-charcoal">{o.name}</span>
                        </span>
                        {o.price > 0 && (
                          <span className="shrink-0 text-sm font-semibold text-charcoal/60">+{money(o.price)}</span>
                        )}
                        <input type={isRadio ? "radio" : "checkbox"} name={`group-${g.id}`} checked={isSel} onChange={() => toggleSimple(g, o.id)} className="sr-only" />
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            );
          })}

          {/* Make it a meal — upsell */}
          {upsells.length > 0 && (
            <fieldset className="mb-6">
              <legend className="mb-2 flex items-center gap-1.5 font-display text-sm font-bold text-charcoal">
                <span aria-hidden>🍽️</span> Make it a meal
              </legend>
              <div className="grid gap-1.5">
                {upsells.map((u) => {
                  const sel = mealAdds.has(u.id);
                  return (
                    <label
                      key={u.id}
                      className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                        sel ? "border-pizza-red bg-pizza-red/5" : "border-charcoal/12 hover:border-charcoal/25"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${sel ? "border-pizza-red bg-pizza-red text-white" : "border-charcoal/25"}`}>
                          {sel && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                        <span className="font-medium text-charcoal">Add {u.name}</span>
                      </span>
                      <span className="shrink-0 text-sm font-semibold text-charcoal/60">+{money(u.price)}</span>
                      <input type="checkbox" checked={sel} onChange={() => toggleMeal(u.id)} className="sr-only" />
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Special instructions */}
          <div className="mt-2">
            <label className="mb-2 block font-display text-sm font-bold text-charcoal">Special instructions</label>
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
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="flex h-11 w-11 items-center justify-center text-xl font-bold text-charcoal/70 hover:text-pizza-red" aria-label="Decrease quantity">
                −
              </button>
              <span className="w-7 text-center font-display text-lg font-bold">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="flex h-11 w-11 items-center justify-center text-xl font-bold text-charcoal/70 hover:text-pizza-red" aria-label="Increase quantity">
                +
              </button>
            </div>
            <button
              onClick={handleAdd}
              className="flex flex-1 items-center justify-between rounded-full bg-pizza-red px-6 py-3.5 font-bold text-white shadow-card transition-colors hover:bg-pizza-red-dark"
            >
              <span>{addCount > 1 ? `Add ${addCount} items` : "Add to order"}</span>
              <span>{money(grandTotal)}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
