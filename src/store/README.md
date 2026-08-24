# Redux Guidelines for Jamia Banuri

These guidelines define how and when to use Redux Toolkit in this project. Please adhere to these rules to keep the Redux store lightweight, performant, and maintainable.

---

## Core Principles

1. **Use Redux Toolkit only when data is shared across multiple pages/components.**
2. **Prefer `useState` (or `useReducer`) for local UI state.**
3. **Do NOT create Redux slices for temporary or page-specific state.**
4. **Keep Redux minimal and lightweight.**

---

## When to Use Redux vs. useState

Before creating a Redux slice or adding fields to an existing slice, ask yourself:

> **"Is this state needed in multiple unrelated components/pages?"**
>
> * **If NO** $\rightarrow$ Use `useState` (or React Context if strictly for deep drilling within the same page/module tree).
> * **If YES** $\rightarrow$ Use Redux.

---

## State Categorization

### Store in Redux:
* **Auth / User data** (logged-in status, token, user profile/permissions)
* **Global settings** (theme, language, global configurations)
* **Notifications** (global toast messages, alert queues)
* **Shared application data** used by many pages/components (e.g., cached master data like categories or static content lists used globally)

### Avoid Redux (Use local state):
* **Form state** (input fields, validation errors, dirty states)
* **Modal state** (open/close flags)
* **Loading state** of a single component/page
* **Table filters** (search queries, sorting, pagination offsets)
* **Local page interactions** (tabs, dropdowns, expanded accordions)
