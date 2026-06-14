# 🐍 Day 3 — Loop Lagao, Life Banao!
### 📅 Date: 12 June 2026 | CPUR Agentic AI Python Course

> *"Ek baar loop samajh liya, toh zindagi mein koi problem nahi aayegi... siwaay infinite loop ke"* 😂

---

## 📁 Folder Structure

```
03_Day_12-06-2026/
│
├── 📓 Notebook/
│   ├── 03_Notebook.ipynb     ← Main lesson - Loops ka Bhagwad Geeta
│   └── task.ipynb            ← Cricket Score Analyzer 🏏 (Task Assignment)
│
└── 📄 Readme.md              ← Ye file jo tu abhi padh raha hai 😎
```

---

## 🎯 Aaj Kya Seekha? (What We Learned Today?)

```
┌─────────────────────────────────────────────────┐
│                                                 │
│   PYTHON LOOPS  🔄                              │
│                                                 │
│   while loop  ──────────────► condition check  │
│   for loop    ──────────────► iterable loop    │
│   nested loop ──────────────► loop ke andar    │
│                                 loop 🤯         │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Topic 1: `while` Loop — "Jab Tak Condition True Hai, Chalta Rahega!"

### Syntax (Simple hai bhai):
```python
i = 0
while i < 8:
    print(f"ZAFAR SUPARI {i} GACH -GOL-ANDAR")
    i += 1
```

### 🧠 While Loop Kaise Kaam Karta Hai?

```
  START
    │
    ▼
┌─────────────┐
│  Condition  │──── FALSE ──► STOP (Loop khatam! Ghar ja!)
│  Check 🤔   │
└─────────────┘
    │ TRUE
    ▼
┌─────────────┐
│  Code Block │  ← Yahan kaam hota hai
│  Execute 💥 │
└─────────────┘
    │
    ▼
  (Wapas condition pe)
```

---

## 🔢 Topic 2: `for` Loop — "Sequence Ka Sabse Accha Dost"

```python
# 1 se 100 tak print (Kaam ki cheez!)
for i in range(1, 101):
    print(i, end=" ")
```

### range() Ka Poora Parivaar 👨‍👩‍👧‍👦

| Function | Matlab | Example |
|----------|--------|---------|
| `range(10)` | 0 se 9 tak | `0,1,2...9` |
| `range(2, 100, 2)` | 2 se 98, step 2 | Even numbers |
| `range(10, 0, -1)` | 10 se 1 tak ulta | Countdown |

---

## 🔁 Topic 3: Loop Control — "Break Matlab Band Karo, Continue Matlab Skip Karo!"

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│  break ──────► Loop ko forcefully band karo! 🛑      │
│                (jaise class mein teacher aa jaye)    │
│                                                      │
│  continue ───► Current iteration skip karo! ⏭️       │
│                (jaise boring subject skip karo)      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Odd Numbers Nikalna (Bitwise Trick! 🤓):
```python
i = 0
while i <= 10:
    i += 1
    if i & 1:       # Bitwise AND — agar odd hai toh 1 aayega
        print(i)
    else:
        continue    # Even ko bhago! 😆
```

---

## 🌀 Topic 4: Nested Loops — "Loop Ke Andar Loop, Matlab Dard Ke Andar Dard 😭"

```python
# Seedha Triangle
i = 0
while i <= 5:
    j = 0
    while j <= i:
        print("", end=" - ")
        j += 1
    print()
    i += 1
```

**Output:**
```
 -
 -  -
 -  -  -
 -  -  -  -
 -  -  -  -  -
 -  -  -  -  -  -
```

---

## ⭐ Topic 5: Pattern Programming — "Jab Loop Art Banane Lagti Hai"

### Patterns Jo Aaj Banaye (Hall of Fame 🏆):

#### 1. Simple Star Row
```
* * * * * * * * * *
```

#### 2. Star Triangle (Seedha)
```
*
* *
* * *
* * * *
```

#### 3. Star Triangle (Ulta)
```
* * * *
* * *
* *
*
```

#### 4. Right-Aligned Triangle (VIP 😎)
```
         *
        * *
       * * *
      * * * *
     * * * * *
    * * * * * *
   * * * * * * *
  * * * * * * * *
 * * * * * * * * *
* * * * * * * * * *
```

#### 5. Rectangle/Box Pattern (Border wala!)
```
* * * * * *
*         *
*         *
*         *
*         *
* * * * * *
```

#### 6. X Pattern (Sabse Tough! 🔥)
```
*        *
  *    *
    **
    **
  *    *
*        *
```

---

## 🛠️ Topic 6: Useful Functions — "Yeh Functions Roz Kaam Aayenge"

| Function | Kya Karta Hai? | Example |
|----------|---------------|---------|
| `len()` | Length batata hai | `len([1,2,3])` → 3 |
| `enumerate()` | Index + Value dono deta hai | `for i,v in enumerate(li)` |
| `zip()` | Multiple sequences milata hai | `for a,b in zip(l1,l2)` |
| `reversed()` | Ulta kar deta hai | `reversed([1,2,3])` |
| `sorted()` | Sort kar deta hai | `sorted([3,1,2])` |
| `range()` | Number sequence banata hai | `range(0,10,2)` |

### enumerate() — "Index Bhi Chahiye, Value Bhi Chahiye" 😏
```python
li = [10, 20, 30, 40, 50, 60, 70]
for i, v in enumerate(li):
    print(i, " - ", v)
# Output: 0 - 10, 1 - 20, ...
```

### zip() — "Teen Ko Ek Mein Milao" 🤝
```python
li   = [10, 20, 30, 40]
t1   = (1, 2, 30, 2)
s1   = "ZAFAR"
for i in zip(li, t1, s1):
    print(i)
# Output: (10, 1, 'Z'), (20, 2, 'A'), ...
```

---

## 🏏 Task: Cricket Score Analyzer

> *"Loops ke saath ek proper project banaya jisme cricket ka score track hota hai. Desi touch ke saath!"* 🏆

### Features:
- 🏏 Overs-wise score input
- 4️⃣ Fours aur 6️⃣ Sixes count
- ⚪ Dot balls track
- 📊 Strike Rate calculate
- 🎯 Performance rating (Desi style mein!)

### Performance Categories:
```
Strike Rate >= 150  ──► "KYa Baat Hai bhai! 🏆"
Strike Rate >= 100  ──► "Average hai Thik Thik 👍"
Strike Rate <  100  ──► "Mehnat kar or 😔"
```

### Score Milestones:
```
Runs >= 100  ──► "Century Ban Gyi Bhai KI 🔥"
Runs >= 50   ──► "Half-Century Ho Gyi! 👏"
Runs < 50    ──► "OR Mehnat KAro! 💪"
```

---

## 📊 Flow Chart — Cricket Analyzer Ka Logic

```
            ┌─────────────┐
            │    START    │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │ Enter Overs │
            └──────┬──────┘
                   │
         ┌─────────▼─────────┐
         │  For each Over:   │
         │  ┌─────────────┐  │
         │  │ Enter 6 ball│  │
         │  │ runs (0-6)  │  │
         │  └──────┬──────┘  │
         │         │         │
         │  ┌──────▼──────┐  │
         │  │  Validate   │  │ ← runs==5 ya <0 ya >6
         │  │  runs 🔍    │  │   → Invalid! Dot Ball
         │  └──────┬──────┘  │
         │         │         │
         │  ┌──────▼──────┐  │
         │  │ Update:     │  │
         │  │ • t_run     │  │
         │  │ • fours     │  │
         │  │ • sixes     │  │
         │  │ • d_ball    │  │
         │  └─────────────┘  │
         └─────────┬─────────┘
                   │
            ┌──────▼──────┐
            │  Calculate: │
            │  Strike Rate│
            │  Boundaries │
            └──────┬──────┘
                   │
            ┌──────▼──────┐
            │   SCORECARD │
            │   Print 📋  │
            └─────────────┘
```

---

## 💡 Aaj Ki Best Line (Quote of the Day)

> *"Ek `while True:` loop likhke `break` bhool gaya... Tab samajha ki infinite loop kya hoti hai! CPU fan ki awaaz aaj bhi sapno mein aati hai"* 😂🔥

---

## 🔗 Resources

- 📓 Main Notebook: [03_Notebook.ipynb](Notebook/03_Notebook.ipynb)
- 📝 Task: [task.ipynb](Notebook/task.ipynb)

---

## 📝 Asif Sir's Classroom Notes

> *In-class notes and live demonstrations shared by our instructor during the session.*

| Resource | Link |
|----------|------|
| 🖊️ **Asif Sir's Colab Notebook — Day 3** | [![Open in Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/drive/1kyG7u7rEDZzlD0j2LqoYgZNOg1M2SFFf?usp=sharing) |

---

*Banaya with 💙 aur thodi si chai ☕ | CPUR Agentic AI Course | Day 3*
