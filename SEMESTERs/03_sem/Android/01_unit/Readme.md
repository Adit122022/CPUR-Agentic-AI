# 📱 Java Pre-Requisites for Android Development

A structured practice checklist of core Java concepts required before diving into **Android Studio**.

---

## 📑 Core Concepts Table

| Category | Java Concept | Android Context & Application | Readiness |
| :--- | :--- | :--- | :---: |
| **1. OOP** | Classes & Objects | Instantiating UI elements and holding screen data state (`new Intent()`). | `[✅]` |
| **1. OOP** | Inheritance (`extends`) | Extending framework classes like `AppCompatActivity` or `Fragment`. | `[✅]` |
| **1. OOP** | Encapsulation | Creating Data Models (POJOs) with `private` fields and `public` getters/setters. | `[✅]` |
| **1. OOP** | Polymorphism & Overriding | Using `@Override` on lifecycle methods like `onCreate()`, `onStart()`, `onPause()`. | `[✅]` |
| **2. Event Handling** | Interfaces (`implements`) | Defining contracts for UI interactions and listener events. | `[✅]` |
| **2. Event Handling** | Anonymous Inner Classes | Passing inline implementations (e.g., `button.setOnClickListener(new View.OnClickListener() {...})`). | `[✅]` |
| **2. Event Handling** | Callback Pattern | Handling asynchronous events and network responses safely. | `[✅]` |
| **3. Collections** | `List` & `ArrayList` | Storing dynamic datasets to populate UI components like `RecyclerView`. | `[✅]` |
| **3. Collections** | `Map` & `HashMap` | Key-value lookup structures for extra parameters (`Intent` extras, configuration objects). | `[✅]` |
| **3. Collections** | Enhanced Loops & Iterators | Traversing lists cleanly for rendering or filtering (`for (Item item : list)`). | `[✅]` |
| **4. Robustness** | Null Safety (`NullPointerException`) | Defensive checks to prevent app crashes when UI elements or API data are missing. | `[✅]` |
| **4. Robustness** | `try-catch-finally` | Handling input validation errors, network failures, or parsing exceptions cleanly. | `[✅]` |
| **5. Data Utility** | Primitive Parsing & String Ops | Using `Integer.parseInt()`, `.trim()`, `.equals()` for form handling. | `[✅]` |
| **5. Data Utility** | `StringBuilder` | Efficient string assembly inside loops without creating excess garbage collector load. | `[✅]` |
| **6. Asynchrony** | Threads & `Runnable` | Understanding UI/Main Thread vs. Background Threads to keep UI responsive. | `[✅]` |

---

## ✅ Practice Checklist

Mark these off as you complete standalone Java practice programs for each topic:

### 1. Object-Oriented Programming (OOP)
- [x] Write a base class `Vehicle` and extend it with `Car`, overriding a `start()` method.
- [x] Create a encapsulated `User` POJO with private fields (`id`, `name`, `email`) and accessors.
- [x] Practice instantiating objects dynamically and passing them into methods.

### 2. Interfaces & Callbacks
- [x] Create a custom `OnClickListener` interface with an `onClick()` contract.
- [x] Build a `Button` class that triggers the listener method.
- [x] Pass an **anonymous inner class** to set the click behavior dynamically.

### 3. Collections Framework
- [x] Initialize an `ArrayList<User>` and write methods to search, add, and remove items.
- [x] Use a `HashMap<String, Integer>` to store items and look up values by unique keys.
- [x] Iterate through a dataset using enhanced `for-each` loops.

### 4. Exception & Null Safety
- [x] Write a method that takes string input, converts it to an integer using `Integer.parseInt()`, and safely catches `NumberFormatException`.
- [x] Practice defensive null checks before calling methods on potentially null objects.

### 5. Multithreading & Asynchrony
- [x] Create a basic background task using `new Thread(new Runnable() { ... }).start()`.
- [x] Print statements from both the main thread and background thread to observe execution order.

---

## 🎯 Final Capstone Challenge
Combine all the concepts above by building a single terminal program:

1. Create a `User` class (Encapsulation).
2. Create a `DataCallback` interface with `onSuccess(List<User> list)` and `onError(String message)`.
3. Create a `UserRepository` that holds an `ArrayList<User>` and simulates fetching data inside a `try-catch` block.
4. Call `fetchUsers()` from `main()` using an **anonymous inner class** callback to display results.
