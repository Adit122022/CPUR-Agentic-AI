"""
🚀 Day 1: Python Basics & Print Function ka Postmortem
Ye file humare pehle din ke concepts ka practical example hai.
Saare code snippets ko acche se format aur document kiya gaya hai,
aap isko direct run karke saare outputs dekh sakte ho!
"""

# ==========================================
# 1. Basic Print (Seedha Output)
# ==========================================
print("--- 1. Basic Print ---")
print("Hello")
print("World")
print() # Ek khali line ke liye

# ==========================================
# 2. Print on the same line (end parameter)
# ==========================================
print("--- 2. Same Line Print ---")
# 'end' parameter by default '\n' (new line) hota hai. 
# Ise space " " de kar hum output ko agli line me jaane se rok sakte hain.
print("Hello", end=" ") 
print("World")
print() # Nayi example ke pehle khali line

# ==========================================
# 3. Escape Sequences (\n aur \t)
# ==========================================
print("--- 3. Escape Sequences ---")
# \n ka matlab nayi line (Enter jaisa)
# \t ka matlab bada space (Tab jaisa)
print("Line 1\nLine 2")
print("Name\tAge")
print("Aditya\t22")
print()

# ==========================================
# 4. Raw String (r) - Escape sequences ki chhutti!
# ==========================================
print("--- 4. Raw Strings ---")
# Agar string ke aage 'r' laga diya, toh \n ya \t waisa ka waisa print hoga.
print(r"Yeh ek raw string hai: \n aur \t yahan kaam nahi karenge!")
print()

# ==========================================
# 5. The 'sep' Parameter (Separator)
# ==========================================
print("--- 5. Sep Parameter ---")
# Multiple items print karte waqt by default space aata hai.
# 'sep' se hum apni marzi ka character daal sakte hain.
print("10", "06", "2026", sep="-")
print("10", "06", "2026", sep=chr(92)) # chr(92) is backslash '\'
print()

# Example: Print details with \n as separator
print("--- Details with '\\n' separator ---")
print(
    "Name: Aditya Sharma", 
    "Roll No: k26798", 
    "Age: 22", 
    "Date: 10-06-2026", 
    "Subject: Python", 
    "College: Career Point University", 
    sep="\n"
)
print()

# ==========================================
# 6. Object Inspection (Kundali nikalna)
# ==========================================
print("--- 6. Object Inspection ---")
my_name = "Aditya"

# dir() - Dikhati hai is object ke paas kaun-kaun se hidden powers (methods/attributes) hain
# print("dir() Output:", dir(my_name)) # Uncomment karke dekho, lamba list aayega!

# help() - Ye poori detailed manual nikal ke de degi.
# help(my_name) # Uncomment to see the manual!

# __doc__ - Ye batata hai ki class/function ka main documentation (docstring) kya hai.
print("String class ka chota sa docstring:")
# Note: 'str' as a variable use karna bad practice hai, isliye upar 'my_name' use kiya
print(type(my_name).__doc__) 

print("\nDay 1 Practical Done! Happy Coding!")