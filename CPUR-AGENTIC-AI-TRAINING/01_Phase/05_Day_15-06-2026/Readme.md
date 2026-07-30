# ⚙️ Day 5 — Functions & File Handling: Python Ka Re-Use Factory!
### 📅 Date: 15 June 2026 | CPUR Agentic AI Python Course

> *"Function ek dabba hai jisme kaam ki recipe hai — ek baar likho, hazaar baar use karo!"* 😄

---

## 📁 Folder Structure

```
05_Day_15-06-2026/
│
├── 📓 Notebook/
│   └── Function.ipynb     ← Aaj ka Gyaan — Functions, Lambda, Recursion, File Handling!
│
├── 🧮 Scientific_Calculator/
│   └── index.html         ← Scientific Calculator Web App
│
└── 📄 Readme.md           ← Ye document jo tu abhi padh raha hai 🤓
```

---

## 🎯 Aaj Ka Agenda (What's Cooking Today? 🍳)

```
┌────────────────────────────────────────────────────────────────────────┐
│                    FUNCTIONS IN PYTHON  ⚙️                              │
│                                                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐  │
│  │ def f(): │  │ lambda   │  │Recursive │  │Generator │  │  File  │  │
│  │ Normal   │  │Anonymous │  │Function  │  │Function  │  │Handling│  │
│  │  😎 def  │  │  ⚡ =>   │  │ 🔄 self  │  │ 🏭 yield │  │ 📂 I/O │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 📚 Pehle Samjho — Function Kya Hoti Hai?

> **Seedha Definition:** Function ek reusable block of code hai jo ek specific task perform karta hai.

**Desi Example:**
```
Maa ki Chai Recipe    ──► Function (ek baar seekha, baar baar banao ☕)
ATM Machine           ──► Function (button dabao, kaam ho jaata hai 💳)
Cricket Match Rules   ──► Function (rules fix hain, khiladi badal sakte hain 🏏)
```

### ✅ Functions ke Fayde (Advantages):

| Faayda | Explanation |
|--------|-------------|
| 🔄 Code Reusability | Ek baar likho, hazaar baar use karo |
| 🚫 No Duplication | Same code baar baar mat likho |
| 👓 Better Readability | Program samajhna aasan ho jaata hai |
| 🛠️ Easy Maintenance | Ek jagah change karo, sab jagah update |
| 🧪 Easy Debugging | Alag alag test kar sakte ho |
| 🧩 Modular Programming | Bada program chhote chhote tukdon mein |

---

## 📋 Part 1: NORMAL FUNCTION — `def` Keyword

### Function Kaise Banate Hain?

```python
# Syntax
def function_name(parameters):
    """Docstring — function ka description"""
    # kaam karo
    return result

# Example
def Greet(n):
    print(f"\n Kya haaal {n} !")

Greet("Aditya")   # Output: Kya haaal Aditya !
```

---

## ⚡ Part 2: ARGUMENTS — Parameters Ka Khel

### 2.1 Positional Arguments
```python
add = lambda a, b: a - b
print(add(b=10, a=200))   # 190 ← keyword se bhi de sakte ho!
```

### 2.2 Default Arguments
```python
def f(a, c, b="Hello"):
    print(a, b, c)

f("A", "C")    # Output: A Hello C ← b ka default "Hello" use hua!
```

### 2.3 `*args` — Variable Length Arguments
```python
def add(*n):
    print(n)   # Tuple mein aa jaata hai sab!

add(1, 1, 1, 1, 1, 1, 1, 1, 1)
# Output: (1, 1, 1, 1, 1, 1, 1, 1, 1)
```

### 2.4 `**kwargs` — Keyword Variable Arguments
```python
def student(**n):
    print(n)   # Dictionary mein aa jaata hai!

student(name="adi", age=24)
# Output: {'name': 'adi', 'age': 24}
```

---

## ⚡ Part 3: LAMBDA — Anonymous Function

```
┌──────────────────────────────────────────────────┐
│         lambda arguments : expression            │
│                                                  │
│  Normal:  def square(n): return n*n              │
│  Lambda:  square = lambda n: n*n                 │
│                                                  │
│  ✅ Short, ✅ One-line, ✅ No name needed         │
└──────────────────────────────────────────────────┘
```

### Lambda Examples:
```python
# Greeting
Greet = lambda n: print(f"\n Kya haaal {n} !")
Greet("Aditya")           # Kya haaal Aditya !

# Math operations
add = lambda a, b: a + b
sub = lambda a, b: a - b
mul = lambda a, b: a * b
div = lambda a, b: a // b
cube = lambda n: n * n * n

print(cube(2))   # 8
```

---

## 🔢 Part 4: Types of Functions — Family Tree

```
                        PYTHON FUNCTIONS
                              │
           ┌──────────────────┼──────────────────┐
           │                                     │
    Built-in Functions                  User-Defined Functions
           │                                     │
    ┌──────┴──────┐                 ┌────────────┬────────────┐
    │             │                 │            │            │
  len()         type()           Normal      Lambda      Recursive
  max()         min()            (def)    (anonymous)   (self-call)
  sum()         round()                                     │
  abs()         print()                                 Generator
                                                        (yield)
```

### Built-in Functions Cheatsheet:
```
┌──────────────────────────────────────────────────────────────┐
│              BUILT-IN FUNCTIONS CHEATSHEET                   │
├─────────────────┬────────────────────────────────────────────┤
│    FUNCTION     │         KYA KARTA HAI?                     │
├─────────────────┼────────────────────────────────────────────┤
│  len(x)         │  Length/size batata hai 📏                 │
│  type(x)        │  Data type batata hai 🏷️                   │
│  max(x)         │  Sabse bada element 📈                     │
│  min(x)         │  Sabse chhota element 📉                   │
│  sum(x)         │  Sab ka total ➕                           │
│  round(x, n)    │  Decimal round karo 🔢                     │
│  abs(x)         │  Absolute value (negative → positive) ➕   │
│  input()        │  User se input lo ⌨️                       │
│  print()        │  Output do 🖨️                              │
│  map(f, iter)   │  Function har element pe lagao 🗺️          │
└─────────────────┴────────────────────────────────────────────┘
```

---

## 🔄 Part 5: RECURSIVE FUNCTION — Function Jo Khud Ko Bulata Hai!

> **Definition:** Recursive function woh hoti hai jo khud ko baar baar call karti hai jab tak base condition poori na ho.

```
┌─────────────────────────────────────────────┐
│              RECURSION FLOW                 │
│                                             │
│  factorial(3)                               │
│      ↓                                      │
│  3 * factorial(2)                           │
│         ↓                                   │
│      2 * factorial(1)   ← BASE CASE!        │
│             ↓                               │
│          return 1                           │
│                                             │
│  Result: 3 * 2 * 1 = 6 ✅                  │
└─────────────────────────────────────────────┘
```

### Recursive Examples:

```python
# 1. Sum of numbers 1 to n
def sum_to_n(n):
    if n == 0:          # Base case
        return 0
    return n + sum_to_n(n-1)

print(sum_to_n(10))   # 55

# 2. Sum of digits of a number
def sum_of_digits(n):
    if n == 0:
        return 0
    return n % 10 + sum_of_digits(n // 10)

print(sum_of_digits(123))   # 6 (1+2+3)

# 3. Factorial
def factorial(n):
    if n == 1:          # Base case
        return 1
    return n * factorial(n-1)

print(factorial(5))   # 120
```

> ⚠️ **Warning:** Infinite recursion runs until stack memory fills — Python stops it with `RecursionError`! Always define a **base case**!

---

## 🏭 Part 6: GENERATOR FUNCTION — `yield` Ka Jadoo

> **Generator** ek lazy function hai — values ek ek karke deta hai, sab ek saath nahi!

```python
def count_up_to(n):
    count = 1
    while count <= n:
        yield count       # Ek value do, ruk jao!
        count += 1

print("Counting up to 5:", tuple(count_up_to(5)))
# Output: Counting up to 5: (1, 2, 3, 4, 5)
```

### Generator vs Normal Function:
```
┌─────────────────────┬────────────────────┬────────────────────┐
│     Feature         │   Normal Function  │    Generator       │
├─────────────────────┼────────────────────┼────────────────────┤
│ Keyword             │  return            │  yield             │
│ Values returned     │  All at once       │  One by one (lazy) │
│ Memory              │  ⬆️ More           │  ⬇️ Less (efficient)│
│ Can be resumed?     │  ❌ Nahi           │  ✅ Haan!           │
│ Use case            │  Small data        │  Large/infinite    │
└─────────────────────┴────────────────────┴────────────────────┘
```

---

**Features:**
- ➕ Basic arithmetic operations (+, −, ×, ÷)
- 🔬 Scientific functions (sin, cos, tan, log, sqrt, power)
- 🧠 Memory functions (MC, MR, M+, M−)
- 📐 Constants (π, e)
- 🌗 Dark/Light theme toggle
- ⌨️ Keyboard support

---

## 📂 Part 7: FILE HANDLING — Python Ka Hard Drive Controller

> *Coming Soon in the next session!* 📂

### Preview — Kya Seekhenge:

```python
# Opening a file
with open("file.txt", "r") as f:
    content = f.read()

# File modes
# "r"  → Read only
# "w"  → Write (overwrite)
# "a"  → Append (add to end)
# "rb" → Read binary
```

| Mode | Kya Karta Hai? |
|------|----------------|
| `"r"` | Read only — file exist karni chahiye ✅ |
| `"w"` | Write — naya create ya overwrite 📝 |
| `"a"` | Append — end mein add karo ➕ |
| `"x"` | Create — already exist ho toh error ❌ |
| `"b"` | Binary mode (images, etc.) 🖼️ |

---

## 🧠 Aaj Ka Mind Map

```
                        FUNCTIONS
                            │
        ┌───────────┬───────┴────────┬───────────┐
        │           │                │           │
    Normal       Lambda          Recursive   Generator
    (def)      (anonymous)      (self-call)   (yield)
        │           │                │           │
    Parameters  Short syntax    Base case    Lazy eval
    *args       One-liner       Stack         yield
    **kwargs    No name         Memory        next()
```

---

## 💡 Aaj Ki Seekh (Today's Wisdom)

> 1. **Functions** — Code reusability ka sabse bada weapon! ⚔️
> 2. **Lambda** — Jab simple ek-line kaam ho, lambda use karo ⚡
> 3. **`*args`** — Jab kitne arguments aayenge nahi pata, star use karo 🌟
> 4. **`**kwargs`** — Named arguments ka group, dictionary format mein 📖
> 5. **Recursion** — Base case zaroori hai, warna stack overflow! 💀
> 6. **Generator** — Large data ke liye memory-efficient solution 🏭
> 7. **Kaafi functions Python built-in hain** — pehle unhe dhundho, phir khud likho! 🔍

---

## 🔥 Aaj Ka Challenge — Calculator Practice

```python
# Notebook mein likha gaya calculator
add = lambda n1, n2: n1 + n2
sub = lambda n1, n2: n1 - n2
mul = lambda n1, n2: n1 * n2
div = lambda n1, n2: n1 // n2
rem = lambda n1, n2: n1 % n2

def calculator():
    a, b = map(int, input("Enter two numbers (comma separated): ").split(","))
    ch = input("Enter operator (+,-,*,/,%): ")
    match ch:
        case "+": print("Addition:", add(a, b))
        case "-": print("Subtraction:", sub(a, b))
        case "*": print("Multiplication:", mul(a, b))
        case "/": print("Division:", div(a, b))
        case "%": print("Remainder:", rem(a, b))
        case _:   print("ERROR: INVALID OPERATOR")
    calculator()  # Recursive call — runs again!

calculator()
```

---

## 📝 Asif Sir's Classroom Notes

> *In-class notes and live demonstrations shared by our instructor during the session.*

| Resource | Link |
|----------|------|
| 🖊️ **Asif Sir's Colab Notebook — Day 5** | [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1p3TG0-egCWU8wl6kY1_mLx2c0IDNj01D?usp=sharing) |

---

## 🔗 Resources

- 📓 Main Notebook: [Function.ipynb](Notebook/Function.ipynb)
- 🐍 Python Docs — Functions: https://docs.python.org/3/tutorial/controlflow.html#defining-functions
- 🐍 Python Docs — Lambda: https://docs.python.org/3/reference/expressions.html#lambda
- 🐍 Python Docs — Generators: https://docs.python.org/3/howto/functional.html#generators

---

*Banaya with 💙, thoda recursion 🔄 aur ek function jo khud ko baar baar call karta raha jab tak coffee nahi mili ☕ | CPUR Agentic AI Course | Day 5*
