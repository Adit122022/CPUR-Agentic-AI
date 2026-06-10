# <span style="color: rgb(0, 120, 215);">🚀 Day 1: Python ka Shubh Aarambh (Intro to Python)</span>

> [!NOTE]
> **Welcome to Day 1, mere dost!** Aaj hum Python ka dissection karenge. Tension nahi lene ka, sab cover hoga, woh bhi ekdum mast style me! 😎

---

## <span style="color: rgb(255, 87, 51);">🎬 Python Ka Code Kaam Kaise Karta Hai? (Behind the scenes)</span>

Jab tum Python ka code likhte ho, toh peeche ek chamatkar hota hai. Tum code likhte ho English me, par tumhara computer sirf `0` aur `1` (Binary) samajhta hai. Beech me yeh sab hota hai:

![Alt text](/01_Day_10-06-2026/media/compile.png)

> [!TIP]
> **Pro Tip:** Bas itna samajh lo, tum `print("Hello")` bolte ho, aur Python apni internal army ko bhej kar usko CPU se process karwata hai!

---

## <span style="color: rgb(0, 188, 212);">🧊 Q1. Set vs Frozen Set in Python?</span>

Dono me kya farq hai? Chalo dekhte hain:

| Feature         | `set` (Aawara Dost) 🕺                    | `frozenset` (Shaadi-shuda Dost) 👨‍👩‍👦                   |
| :-------------- | :---------------------------------------- | :--------------------------------------------------- |
| **Nature**      | **Mutable** (Changeable)                  | **Immutable** (Unchangeable)                         |
| **Flexibility** | Naye elements add ya remove kar sakte ho. | Koi naya dost add nahi ho sakta, koi jaa nahi sakta. |
| **Status**      | Kabhi bhi aa sakte hain, jaa sakte hain.  | Ekdum jam gaya (frozen)! 🥶                          |

---

## <span style="color: rgb(46, 204, 113);">🐍 History of Python</span>

Bhai, Python 1989 (Christmas ki chhuttiyo me bore hote hue) me **Guido van Rossum** ne banaya tha.

> [!IMPORTANT]  
> Ye kisi saanp 🐍 ke naam pe nahi, balki **'Monty Python's Flying Circus'** naam ke ek British comedy show se inspired tha! Sirf timepass me shuru kiya project aaj puri duniya hila raha hai.

**Padhne ka shauk hai? Ye lo links:**

- 🔗 [Wikipedia: History of Python](https://en.wikipedia.org/wiki/History_of_Python)
- 🔗 [GeeksForGeeks: History of Python](https://www.geeksforgeeks.org/history-of-python/)

---

## <span style="color: rgb(155, 89, 182);">🤔 Programming Kya Hai?</span>

Programming bas computer ko gaaliyo ki jagah instructions dena hai ki _"Bhai mere ye kaam karke de, warna main system tod dunga"_.

Jokes apart, it is the process of writing instructions (code) for a computer to perform a specific task, kyunki computer apna dimag khud nahi lagata.
_Aur gyaan batorna hai?_ 👉 [What is Programming? - Codecademy](https://www.codecademy.com/resources/blog/what-is-programming/)

---

## <span style="color: rgb(230, 126, 34);">📉 Low-Level vs High-Level Languages 📈</span>

| Language Type  | Kya Hota Hai Ye?                                                                       | Execution Speed | Examples                   |
| :------------- | :------------------------------------------------------------------------------------- | :-------------- | :------------------------- |
| **Low-Level**  | Ye computer ki apni bhasha hai (`0s` and `1s`).                                        | Ekdum tezz ⚡   | Machine Language, Assembly |
| **High-Level** | Ye humare jaise aalsi insaano ke liye hai jo English jaisi bhasha me code likhte hain. | Thodi slow 🐢   | Python, Java, C++          |

> [!CAUTION]  
> Low-level padhne jaoge toh dimaag ki dahi ho jayegi. Insaano ke sarr ke upar se jaati hai!

---

## <span style="color: rgb(218, 165, 32);">⚖️ C Language Mid-Level Kyu Hai?</span>

Kyunki C language **beech ka bandar** hai! 🐒

- Isme **high-level** languages wale aasaan features (jaise `functions`, `loops`) bhi hain.
- Aur **low-level** wale hardware se khelne ke tarike (`pointers`, `memory management`) bhi hain. Tum hardware level par bhi ungli kar sakte ho aur software bhi bana sakte ho.

---

## <span style="color: rgb(231, 76, 60);">🎯 Python Kyu Banaya? (Purpose of Python)</span>

Guido bhai ko ek aisi language chahiye thi jo **C jaisi powerful** ho, par **ABC language jaisi padhne me aasan** ho. Python isliye banaya gaya taaki developers ka dimag code ke syntax likhne se zyada **Logic** lagane me use ho.

> _"Code kam, kaam zyada!"_ - yahi Python ka primary asool hai.

---

## <span style="color: rgb(52, 152, 219);">🤖 AI / Gen AI / Machine Learning ka Rishta</span>

Samjho, AI ek bada sa universe hai, aur baaki sab uske chhote-chhote planet:

![Alt text](/01_Day_10-06-2026/media/ai.png)

---

## <span style="color: rgb(255, 20, 147);">🎭 OOPS Kya Bala Hai?</span>

OOPs yaani **Object-Oriented Programming System**. Ye programming ka ek style jaha hum real-world cheezon ko "Objects" maan kar code likhte hain.

**Short description:**

- 📐 **Class:** Ek naksha (blueprint) hota hai. _(Jaise Car ka design)_
- 🚗 **Object:** Us nakshae se bani hui asli cheez. _(Jaise tumhari padosi ki Alto Car)_

Isme kuch fancy features hote hain jaise:

1. **Inheritance** (baap-dada ki property lena)
2. **Polymorphism** (ek cheez ke anek roop)
3. **Encapsulation** (data chupana)
4. **Abstraction** (sirf kaam ki cheez dikhana)

---

## <span style="color: rgb(255, 140, 0);">📓 Google Colab & Jupyter Notebooks</span>

Class me humne **Google Colab** use kiya tha. Google Colab free me cloud par Jupyter Notebooks chalane ka mast jugaad hai. Na koi setup, na laptop hang hone ki tension!

Humare `NoteBook` folder ke andar ek file hai `02_After_Break.ipynb`, jisme humne class ke baad ye sab seekha:

- 📥 <span style="color: rgb(100, 149, 237);">**Input Functions:**</span> `input()` kaise kaam karta hai aur `split()` se ek sath alag-alag values kaise len.
- ➕ <span style="color: rgb(100, 149, 237);">**Airthmetic Operators:**</span> `+`, `-`, `*`, `/`, `%` (Remainder) aur `//` (Floor division). Humne rectangle aur square ka area/diff nikala.
- 🤔 <span style="color: rgb(100, 149, 237);">**Logical Operators:**</span> AND, OR, NOT.
- ⚖️ <span style="color: rgb(100, 149, 237);">**Relational Operators:**</span> `<`, `>`, `==`, `!=` etc.

> [!TIP]
> Jupyter Notebook ya Google Colab data science walo ke liye swarg hai. Ek cell me code likho, chalao, aur turant output dekho!

---

## <span style="color: rgb(3, 201, 169);">🎁 Extra Gyaan (Bonus Round!)</span>

> [!NOTE]  
> Yahan kuch choti-choti magar moti baatein hain jo interview me kaam aa sakti hain. Humne isko tod diya hai taaki easily padha jaa sake.

### 🌟 <span style="color: rgb(72, 201, 176);">Python Ki Khaasiyat & Upyog</span>

- **Features:** Easy to learn (bacchon ka khel hai), Free & Open-Source (muft, muft, muft!), Object-Oriented, aur isme bahot saari in-built libraries milti hain.
- **Applications:** AI/ML models banane me, Web Development (Django/Flask) me, aur Data Analysis me.
- **Installation:** Seedha python.org pe jao, install karo _(Add to PATH tick karna mat bhoolna)_. VS Code me Python extension daal lena.

### 📦 <span style="color: rgb(72, 201, 176);">Variables & Datatypes</span>

- **Naming Rules:** Variable ek dabba hai jisme data rakhte hain. Rule: Number se shuru nahi ho sakta (`1name` ❌, `name1` ✅), spaces nahi chalte, special characters allowed nahi sivaaye underscore (`_`) ke.
- **Datatypes:**
  - **Integer:** Pura number (e.g., `5`, `-10`)
  - **Float:** Decimal wala number (e.g., `3.14`)
  - **String:** Text, quotes ke andar (e.g., `"Aditya"`)
  - **Boolean:** Sach ya Jhooth (`True` ya `False`)
- **Dynamic Typing:** Tumhe type batane ki zaroorat nahi! `x = 5` likho toh Python maan leta hai `int` hai.

### 🗣️ <span style="color: rgb(72, 201, 176);">Input/Output & Formatting</span>

- **I/O Statements:** User se value lene ke liye `input()` aur dikhane ke liye `print()`.
- **Typecasting (Type Conversion):** Ek datatype ko dusre me badalna (Jaise `str(5)` banega `"5"`).
- **String Formatting:** F-strings sabse best tareeka hai: `print(f"Mera naam {name} hai")`. Ekdum clean!

---

<div align="center" style="font-size: 24px; font-weight: bold; color: rgb(255, 136, 0); margin-top: 20px; padding: 10px; border: 2px dashed rgb(255, 136, 0); border-radius: 10px; background-color: rgba(255, 136, 0, 0.1);">
  Bhai log, Day 1 me yahi sab bhasad machayi thi. Happy Coding! 💻🎉
</div>
