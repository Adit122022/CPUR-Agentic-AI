# # 1  Write a Python program to take user input for name, age, and city, then print a message like:
# #    ("Hello , my name is John , I am 25 years old & I live in New York")

#     #write a program to input two no. & display their sum , difference , product and quotient
# # num1, num2 = map(float, input("Enter two numbers: ").split())

# # print("Sum:", num1 + num2)
# # print("Difference:", num1 - num2)
# # print("Product:", num1 * num2)
# # print("Quotient:", num1 / num2 if num2 != 0 else "undefined")
    
#  # Ask the user to  enter a temperature in celsius, convert it to fahrenheit, & print the result.
# # temp = int(input("Enter the temperature :"))
# # print("Fahrenheit :", float((temp * 1.8)+32))

# # 2 . Write a script that asks for three numbers and calculates their average.
# # a,b,c = map(int , input("ENter three numbers sepearte with space").split())
# # print("Average :" , (a+b+c)//3)

# # 3 .Write a program to accept a character from the user and print its ASCII value.
# # (Hint: Use ord() function)
# # ch = input("Enter A Character :")
# # print("ASCII CODE :",ord(ch))


# # 4 . Write a Python program that accepts a sentence from the user and prints:
# # Total number of words
# # Total number of characters
# # (Hint: Use split() for words and len() for characters.)

# # s = input("Enter a sentence: ")
# # w= len(s.split())        # total words
# # ch = len(s)           # total characters
# # print(f"Total number of words: {w}")
# # print(f"Total number of characters: {ch}")


# # 5 . Take name and percentage from the user and display it using different formatting methods (format(), f-strings, and % formatting).
# # name = input("Enter your name: ")
# # p = float(input("Enter your percentage: "))
# # # Using format()
# # print("Using format(): Name: {}, Percentage: {}".format(name, p))
# # # Using f-string
# # print(f"Using f-string: Name: {name}, Percentage: {p}")
# # # Using % formatting
# # print("Using %% formatting: Name: %s, Percentage: %.1f" % (name, p))

# # 6 .Write a program that reads two numbers from the user and prints the result in the following format:
# #  first number :10
# #  second number :20
# # sum :30
# # Difference :-10
# # Product :200
# # Quotitent :0.5
# # a, b = map(float, input("Enter two numbers: ").split())
# # print(f"first number :{a}\nsecond number :{b}\nsum :{a+b}\ndifference :{a-b}\nproduct :{a*b}\nquotient :{a/b if b!=0 else 'undefined'}")


# # 7 .Write a program to take a multi-line input from the user and count the total number of vowels in it.

# # text = ""
# # print("Enter text (type END on a new line to finish):")

# # while True:
# #     line = input()
# #     if line.upper() == "END":
# #         break
# #     text += line

# # vowels = sum(1 for ch in text.lower() if ch in "aeiou")
# # print("Total vowels:", vowels)


# # 8 .Accept a user’s name and display it in uppercase, lowercase, and title case.
# # name = input("Enter your name: ")

# # print("Uppercase:", name.upper())
# # print("Lowercase:", name.lower())
# # print("Title case:", name.title())


# # 9 . Create a simple calculator that asks the user for two numbers and an operator (+, -, *, /, %, **) and performs the calculation accordingly.
# # a = float(input("Enter first number: "))
# # b = float(input("Enter second number: "))
# # op = input("Enter operator (+, -, *, /, %, **): ")

# # if op == "+":
# #     print("Result:", a + b)
# # elif op == "-":
# #     print("Result:", a - b)
# # elif op == "*":
# #     print("Result:", a * b)
# # elif op == "/":
# #     print("Result:", a / b if b != 0 else "undefined (division by zero)")
# # elif op == "%":
# #     print("Result:", a % b)
# # elif op == "**":
# #     print("Result:", a ** b)
# # else:
# #     print("Invalid operator!")

# # 10 . Write a program to accept two numbers from the user and swap them without using a third variable.
# # a = float(input("Enter first number: "))
# # b = float(input("Enter second number: "))

# # a, b = b, a   # swapping without 3rd variable

# # print("After swapping:")
# # print("First number:", a)
# # print("Second number:", b)


# # 11. Ask the user for their birth year and calculate their current age dynamically.

# # from datetime import datetime

# # birth_year = int(input("Enter your birth year: "))
# # current_year = datetime.now().year
# # age = current_year - birth_year
# # print("Your current age is:", age)

# # 12. Develop a Python script where the user enters a file name, and the program should check whether the file exists in the current directory. 
# # (Hint: Use os module)

# # import os

# # filename = input("Enter file name: ")

# # if os.path.isfile(filename):
# #     print("File exists in the current directory.")
# # else:
# #     print("File does NOT exist in the current directory.")

# # 13 .Create a Python quiz program where the user answers multiple-choice questions, and the script gives them a score.
# # score = 0

# # print("=== Python Quiz ===")

# # # Q1
# # print("\n1. Which keyword is used to define a function?")
# # print("a) func   b) def   c) function   d) define")
# # if input("Your answer: ").lower() == "b":
# #     score += 1

# # # Q2
# # print("\n2. What is the output of 3 * 2 ** 2?")
# # print("a) 12   b) 16   c) 24   d) 8")
# # if input("Your answer: ").lower() == "a":
# #     score += 1

# # # Q3
# # print("\n3. Which data type is immutable?")
# # print("a) list   b) dictionary   c) set   d) tuple")
# # if input("Your answer: ").lower() == "d":
# #     score += 1

# # print("\nYour Total Score:", score, "/ 3")


# # ========================================================================================================================================
# # Section 2: String Formatting & Output Formatting

# # 1 .Write a program that prints a table format output for student details using format().
# # name     age    grade
# # alice    20      A
# # Bob      21      B+
# # Charlie  19      A-

# # print("{:<10} {:<5} {:<5}".format("Name", "Age", "Grade"))
# # print("{:<10} {:<5} {:<5}".format("Alice", 20, "A"))
# # print("{:<10} {:<5} {:<5}".format("Bob", 21, "B+"))
# # print("{:<10} {:<5} {:<5}".format("Charlie", 19, "A-"))

# # 2 .Ask the user for a price of an item and display it in currency format (e.g., $10.50).
# # price = float(input("Enter the price of the item: "))
# # print("Price in currency format: ${:.2f}".format(price))


# # 3 .Take a floating-point number from the user and print it rounded to 2 decimal places.
# # num = float(input("Enter a floating-point number: "))
# # print("Rounded value:", round(num, 2))

# # 4 .Print a right-aligned table of numbers using rjust() and format().
# # print("Using rjust():")
# # print("Number".rjust(10), "Square".rjust(10))
# # for i in range(1, 6):
# #     print(str(i).rjust(10), str(i*i).rjust(10))

# # print("\nUsing format():")
# # print("{:>10} {:>10}".format("Number", "Square"))
# # for i in range(1, 6):
# #     print("{:>10} {:>10}".format(i, i*i))



# # 5. Format a number as percentage (%) with two decimal places.
# # (Example: 0.75 should be displayed as 75.00%.)
# # num = float(input("Enter a number: "))
# # print("Percentage:", "{:.2f}%".format(num * 100))



# # 6 . Write a program to display a bill receipt in a formatted way using f-strings:
# # Item prices
# # items =[]
# # total =0
# # print("Enter items name & price . Type 'done'to Finish. \n")
# # while True:
# #     name =input("Item Name :")
# #     if name.lower() =='done':
# #         break
# #     price = float(input("Enter price :"))
# #     items.append((name , price))
# #     print()
# # print(f"{'Item':<12}{'Price'}")
# # print("-" * 25)

# # for name,price in items :
# #     print(f"{name :<12} ${price :.2f}")
# #     total+=price

# # print("-" * 25)
# # print(f"{'Total':<12}${total:.2f}")

# # 7.Ask the user for their name and marks in 3 subjects, then display a formatted scorecard:

# # name = input("Enter Name of students :")
# # subject =[]
# # print("Enter Subject name . Type 'done'to Finish. \n")
# # while True :
# #     sbName = input("Enter name of the subject :")
# #     if sbName.lower() == 'done' :
# #         break
# #     marks = float(input("Enter marks :"))
# #     subject.append((sbName , marks))
# #     print()

# # print(f"{'Name ':<12}{name}")
# # print("-" * 25)

# # for sbName , marks  in subject :
# #    print(f"{sbName :<12}  : {marks :.2f}")
# #    total+=marks
# # print("-" * 25)
# # # Total marks printed
# # print(f"{'Total Marks':<12}: {total:.2f}")

# # # Percentage (Assuming each subject is out of 100)
# # percentage = (total / (len(subject) * 100)) * 100

# # print(f"{'Percentage':<12}: {percentage:.2f}%")


# # 8 Print a receipt for a shopping bill, where all amounts should be right-aligned in columns.
# # items = []
# # print("Enter items (type 'done' as item name to finish):\n")

# # while True:
# #     name = input("Item name: ")
# #     if name.lower() == "done":
# #         break
# #     qty = int(input("Quantity: "))
# #     price = float(input("Price (per unit): "))
# #     amount = qty * price
# #     items.append((name, qty, price, amount))
# #     print()

# # # Print receipt with right-aligned numeric columns
# # print("\n" + f"{'Item':<20}{'Qty':>5}{'Price':>12}{'Amount':>12}")
# # print("-" * 49)

# # total = 0
# # for name, qty, price, amount in items:
# #     total += amount
# #     price_str = "$" + format(price, ",.2f")       # e.g. $1,234.56
# #     amount_str = "$" + format(amount, ",.2f")
# #     print(f"{name:<20}{qty:>5}{price_str:>12}{amount_str:>12}")

# # print("-" * 49)
# # total_str = "$" + format(total, ",.2f")
# # print(f"{'Total':<20}{'':>5}{'':>12}{total_str:>12}")


# # 9 .Display the current date and time in different formats using strftime().

# # from datetime import datetime

# # # Current date & time
# # now = datetime.now()

# # print("Default datetime:", now)

# # # Different formats using strftime()

# # print("1. Date (DD/MM/YYYY):", now.strftime("%d/%m/%Y"))
# # print("2. Date (Month Day, Year):", now.strftime("%B %d, %Y"))
# # print("3. Time in 24-hour format:", now.strftime("%H:%M:%S"))
# # print("4. Time in 12-hour format:", now.strftime("%I:%M:%S %p"))
# # print("5. Full date & time:", now.strftime("%d-%m-%Y %H:%M:%S"))
# # print("6. Day name:", now.strftime("%A"))
# # print("7. Short day name:", now.strftime("%a"))
# # print("8. Month name:", now.strftime("%B"))
# # print("9. Short month name:", now.strftime("%b"))
# # print("10. ISO format:", now.strftime("%Y-%m-%dT%H:%M:%S"))


# # 10 . Write a program that takes a user’s name and displays it in a stylized format using center() method:
# # name = input("Enter name: ")
# # print(name.center(len(name) + 4).center(len(name) + 14, '*')) 


# # =====================================================================================================================
# # Section 3: Python Operators


# # 1. Write a Python program to perform addition, subtraction, multiplication, division, modulus, exponentiation, and floor division on two numbers.

# a = float(input("Enter first number: "))
# b = float(input("Enter second number: "))

# print("Addition:", a + b)
# print("Subtraction:", a - b)
# print("Multiplication:", a * b)
# print("Division:", a / b)
# print("Modulus:", a % b)
# print("Exponentiation:", a ** b)
# print("Floor Division:", a // b)


# # 2. Demonstrate the use of comparison (relational) operators in a Python script.

# x = 10
# y = 20

# print("x == y :", x == y)
# print("x != y :", x != y)
# print("x > y  :", x > y)
# print("x < y  :", x < y)
# print("x >= y :", x >= y)
# print("x <= y :", x <= y)


# # 3. Write a Python program to check whether a number is even or odd using the modulus operator (%).

# num = int(input("Enter a number: "))
# print("Even" if num % 2 == 0 else "Odd")


# # 4. Accept a user’s age and determine if they are eligible to vote (age >= 18).

# age = int(input("Enter your age: "))
# print("Eligible to vote" if age >= 18 else "Not eligible to vote")


# # 5. Use the not operator to check if a user’s input is NOT an empty string.

# text = input("Enter something: ")
# print("Input is NOT empty" if not (text == "") else "Input is empty")


# # 6. Check if a number is positive, negative, or zero.

# n = int(input("Enter a number: "))
# if n > 0:
#     print("Positive")
# elif n < 0:
#     print("Negative")
# else:
#     print("Zero")


# # 7. Take three numbers as input and find the largest number using logical operators (and, or).
# a, b, c = map(float, input("Enter three numbers: ").split())
# if a >= b and a >= c:
#     print("Largest:", a)
# elif b >= a and b >= c:
#     print("Largest:", b)
# else:
#     print("Largest:", c)


# # 8. Implement a simple login system where the correct username and password grant access using logical operators.

# user = input("Enter username: ")
# pwd = input("Enter password: ")

# if user == "admin" and pwd == "1234":
#     print("Login Successful!")
# else:
#     print("Invalid username or password")


# # 9. Demonstrate the use of bitwise AND, OR, XOR, and NOT operators with examples.

# x = 6   # 110
# y = 3   # 011

# print("Bitwise AND:", x & y)
# print("Bitwise OR:", x | y)
# print("Bitwise XOR:", x ^ y)
# print("Bitwise NOT (~x):", ~x)


# # 10. Accept a number from the user and check if it is divisible by both 3 and 5 using the logical AND operator.

# n = int(input("Enter a number: "))
# print("Divisible by both 3 and 5" if n % 3 == 0 and n % 5 == 0 else "Not divisible")


# # 11. Write a program that asks the user for a numeric grade (0-100) and assigns a letter grade (A, B, C, D, F) based on conditions.

# marks = int(input("Enter marks (0-100): "))

# if marks >= 90:
#     grade = "A"
# elif marks >= 80:
#     grade = "B"
# elif marks >= 70:
#     grade = "C"
# elif marks >= 60:
#     grade = "D"
# else:
#     grade = "F"

# print("Grade:", grade)


# # 12. Implement compound assignment operators to modify a variable’s value dynamically.

# num = 10
# num += 5   # num = num + 5
# num -= 2   # num = num - 2
# num *= 3   # num = num * 3
# print("Final value:", num)


# # 13. Accept a 4-digit number from the user and display the sum of its digits using floor division and modulus operators.

# n = int(input("Enter a 4-digit number: "))

# d1 = n // 1000
# d2 = (n // 100) % 10
# d3 = (n // 10) % 10
# d4 = n % 10

# print("Sum of digits:", d1 + d2 + d3 + d4)


# # 14. Implement a bitwise calculator that performs AND, OR, XOR, and shift operations on two user-provided integers.

# a = int(input("Enter first integer: "))
# b = int(input("Enter second integer: "))

# print("AND:", a & b)
# print("OR:", a | b)
# print("XOR:", a ^ b)
# print("Left shift a<<1:", a << 1)
# print("Right shift b>>1:", b >> 1)


# # 15. Write a Python script to perform a mathematical operation based on user choice:
# #       a.) 1 for addition
# #       b.) 2 for subtraction
# #       c.) 3 for multiplication
# #       d.) 4 for division

# print("\n1.Addition\n2.Subtraction\n3.Multiplication\n4.Division")
# choice = int(input("Enter your choice (1-4): "))

# x = float(input("Enter first number: "))
# y = float(input("Enter second number: "))
# res =0
# if choice == 1:
#     res = x + y
# elif choice == 2:
#     res = x - y
# elif choice == 3:
#     res = res+1
#     res = x * y
# elif choice == 4:
#     res = x / y
# else:
#     print("Invalid choice")
# print(res)



# =========================================================================================================
# Unit-I: Basics of Python Programming (20 Questions)
# 1. Write a program to display "Hello, World!" on the screen.✅
# print("Hello World!")
# 2. Write a Python program to perform addition, subtraction, multiplication, and division of two numbers.✅
# 3. Write a program to check whether a number is positive, negative, or zero.✅
# 4. Implement a Python program to swap two variables without using a third variable.✅
# 5. Write a program to check whether a number is even or odd.✅
# 6. Write a program to find the largest of three numbers using nested `if-else`.✅
# 7. Implement a calculator that performs addition, subtraction, multiplication, and division based on user
# input.✅
# 8. Write a Python program to display the Fibonacci series up to `n` terms.
# a= int(input("Enter number :"))
# fibo =[1,1]
# i=2
# while i<=a :
#     fibo.append(fibo[i-1] +fibo[i-2])
#     i+=1
# print(fibo)



# 9. Implement a Python program to check whether a given number is a palindrome.
# a= int(input("Enter number :"))
# b = a
# rev =0
# while a >0 :
#     d = a % 10
#     rev= rev *10 +d
#     a = a//10
# if(b == rev) : print(" PALINDROM")
# else : print("INVALID  PALINDROM")

# 10. Write a program to find the factorial of a number using a `for` loop.

# a = int(input("Enter Number :"))
# fact =1
# for i in range(1,a+1) :
#     fact*=i
# print(fact)

# 11. Implement a program to calculate the sum of the first `n` natural numbers.
# a = int(input("Enter Number :"))
# sum =0
# for i in range(1,a+1) :
#     sum+=i
# print(sum)



# 12. Write a Python program to count the number of vowels and consonants in a string.
# string = input("Enter a string: ")
# vowels = "aeiouAEIOU"
# v_count = 0
# c_count = 0
# for ch in string:
#     if ch.isalpha():          # Check only letters
#         if ch in vowels:
#             v_count += 1
#         else:
#             c_count += 1
# print("Total Vowels:", v_count)
# print("Total Consonants:", c_count)


# 13. Write a Python program to find the largest and smallest numbers in a list.
# list = [1,2,3,4,5,6,7]
# print("Largest :" ,max(list))
# print("Smallest  :" ,min(list))

#  second way  
# nums = list(map(int, input("Enter numbers separated by space: ").split()))
# largest = nums[0]
# smallest = nums[0]
# for n in nums:
#     if n > largest:
#         largest = n
#     if n < smallest:
#         smallest = n

# print("Largest number is:", largest)
# print("Smallest number is:", smallest)




# 14. Implement a Python program to reverse a number.
# n = int(input("Enter number: "))
# rev = int(str(n)[::-1])
# print("Reversed:", rev)

# second way 
# num = int(input("Enter number: "))
# rev = 0
# while num > 0:
#     digit = num % 10
#     rev = rev * 10 + digit
#     num //= 10
# print("Reversed number:", rev)


# 15. Write a Python program to check if a string is a palindrome.
# n = input("Enter String: ")
# rev = str(n)[::-1]
# if(rev == n) : print("PAlindrom  :",rev)
# else : print("Not Palindrom   :" ,rev)


# 16. Implement a Python program to print a multiplication table for a given number.
# num = int(input("Enter number :"))
# for i in range(1,11) :
#     print(f"{num} * {i}  :" ,num*i)


# 17. Write a program to demonstrate the use of `break` and `continue` statements.
# for i in range(1, 100):
#     if i % 5 == 0:
#         continue
#     if i == 61:
#         break
#     print(i)


# 18. Write a Python program to calculate the sum of digits of a number using a `while` loop.
# num = int(input("Enter number :"))
# sum =0
# i=0
# while num >0 :
#     digit = num % 10
#     sum+=digit
#     num//=10
# print(sum)


# 19. Implement a Python program to print the prime numbers between two intervals.
# start = int(input("Enter start of interval: "))
# end = int(input("Enter end of interval: "))

# print(f"Prime numbers between {start} and {end} are:")

# for num in range(start, end + 1):
#     if num > 1:  # 1 se chhote number prime nahi hote
#         for i in range(2, int(num**0.5) + 1):
#             if num % i == 0:
#                 break  # divisible → not prime
#         else:
#             print(num)


# 20. Write a program to check if a number is a prime number.
# num = int(input("Enter a number: "))

# if num <= 1:
#     print(num, "is not a prime number")
# else:
#     for i in range(2, int(num**0.5) + 1):
#         if num % i == 0:
#             print(num, "is not a prime number")
#             break
#     else:
#         print(num, "is a prime number")



# ***************************************************************************************
### Unit-II: String Manipulation and Data Structures (20 Questions)
      
# 21. Write a program to extract a substring from a given string.

# text = input("Enter a string: ")
# start = int(input("Enter starting index: "))
# end = int(input("Enter ending index: "))

# substring = text[start:end]  # slicing
# print("Substring:", substring)



# 22. Implement a program to count the occurrences of each word in a string.
# text = input("Enter a string: ")
# words = text.split()  # split into words
# count = {}  # empty dictionary
# for word in words:
#     word = word.lower()  # optional: ignore case
#     if word in count:
#         count[word] += 1
#     else:
#         count[word] = 1
# # Print word occurrences
# for word, freq in count.items():
#     print(f"{word} : {freq}")

# 23. Write a Python program to check whether a given string is a pangram.
# import string

# def is_pangram(s):
#     # Convert to lowercase
#     s = s.lower()
    
#     # Create a set of all alphabets
#     alphabets = set(string.ascii_lowercase)
    
#     # Check if every alphabet exists in the string
#     return alphabets.issubset(set(s))

# # Taking input
# text = input("Enter a string: ")

# if is_pangram(text):
#     print("The string IS a pangram.")
# else:
#     print("The string is NOT a pangram.")


# 24. Write a program to find all permutations of a given string.
# from itertools import permutations

# Take input
# s = input("Enter a string: ")

# # Generate all permutations
# perms = [''.join(p) for p in permutations(s)]

# # Print all permutations
# print("All permutations:")
# for p in perms:
#     print(p)

# #  second way without module
# def get_permutations(s):
#     if len(s) == 1:
#         return [s]
    
#     perms = []
#     for i in range(len(s)):
#         fixed = s[i]
#         remaining = s[:i] + s[i+1:]
        
#         for p in get_permutations(remaining):
#             perms.append(fixed + p)
    
#     return perms

# # Input
# s = input("Enter a string: ")

# # Output
# result = get_permutations(s)
# print("All permutations:")
# for p in result:
#     print(p)


# 25. Implement a Python program to remove duplicate characters from a string.
# def remove_dublicates(s):
#     result = ''
#     seen =set()
#     for char in s:
#         if char not in seen:
#             result+=char
#             seen.add(char)
#     return result
# text = input("Enter a string :")
# print("Your string is  : " , remove_dublicates(text))



# 26. Write a program to reverse the words in a given string.
# def rev(s):
#     words = s.split()
#     rev_words = words[ : : -1]
#     return " ".join(rev_words)
# text = input("ENter a string :")
# print("your reverse words :" , rev(text))



# 27. Implement a Python program to count the frequency of characters in a string.
# def freq_char(s):
#     freq ={}
#     for ch in s :
#         if ch in freq :
#             freq[ch] +=1
#         else :
#             freq[ch] =1
#     return freq
# text = input("Enter  a String :")
# result = freq_char(text)
# print("Character frequency :")
# for char , count in result.items() :
#     print(f" {char}  :  {count}")


# 28. Write a program to demonstrate the use of string slicing.
# Input string
# s = input("Enter a string: ")
# print("\n--- String Slicing Results ---")
# # 1. Full string
# print("Full string:", s[:])
# # 2. First 5 characters
# print("First 5 characters:", s[:5])
# # 3. Last 5 characters
# print("Last 5 characters:", s[-5:])
# # 4. Characters from index 2 to 7
# print("Characters from index 2 to 7:", s[2:8])
# # 5. Every 2nd character
# print("Every 2nd character:", s[::2])
# # 6. Reverse the string
# print("Reversed string:", s[::-1])


# 29. Implement a Python program to find the length of a string without using `len()`.
# s = input("Enter a string :")
# count =0 
# for _ in s :
#     count+=1
# print("Length :", count)


# 30. Write a program to capitalize the first letter of each word in a string.
# def capitalize_words(s):
#     result = ""
#     capitalize_next = True
#     for ch in s:
#         if capitalize_next and ch.isalpha():
#             result += ch.upper()
#             capitalize_next = False
#         else:
#             result += ch
#         if ch == " ":
#             capitalize_next = True
#     return result
# text = input("Enter a string: ")
# print("Capitalized string:", capitalize_words(text))


# 31. Write a Python program to find the second largest element in a list.
# arr = list(map(int, input("Enter numbers separated by space: ").split()))

# first = second = float('-inf')

# for num in arr:
#     if num > first:
#         second = first
#         first = num
#     elif first > num > second:
#         second = num

# print("Second largest element:", second)

# 32. Implement a program to remove duplicates from a list.
# arr = list(map(int, input("Enter numbers: ").split()))

# unique = []
# seen = set()

# for x in arr:
#     if x not in seen:
#         unique.append(x)
#         seen.add(x)

# print("List after removing duplicates:", unique)


# 33. Write a Python program to check if two lists are equal.
# list1 = list(map(int, input("Enter list 1 elements: ").split()))
# list2 = list(map(int, input("Enter list 2 elements: ").split()))

# if sorted(list1) == sorted(list2):
#     print("Both lists have the same elements (order ignored).")
# else:
#     print("Lists are NOT equal.")



# 34. Implement a Python program to find the union and intersection of two lists.
# list1 = list(map(int, input("Enter list 1 elements: ").split()))
# list2 = list(map(int, input("Enter list 2 elements: ").split()))

# # Convert to sets
# set1 = set(list1)
# set2 = set(list2)

# # Union
# union_result = list(set1 | set2)

# # Intersection
# intersection_result = list(set1 & set2)

# print("Union:", union_result)
# print("Intersection:", intersection_result)


# 35. Write a program to demonstrate list comprehension by creating a list of squares of even numbers
# from 1 to 20.
# squares = [x*x for x in range(1, 21) if x % 2 == 0]

# print("Squares of even numbers from 1 to 20:")
# print(squares)


# 36. Implement a Python program to add and remove elements from a tuple.
# Original tuple
# t = (10, 20, 30, 40)
# print("Original Tuple:", t)
# temp_list = list(t)       # Convert to list
# temp_list.append(50)      # Add element
# t = tuple(temp_list)      # Convert back to tuple
# print("Tuple after adding 50:", t)
# # ---- Remove Element ----
# temp_list = list(t)       # Convert again
# temp_list.remove(20)      # Remove element
# t = tuple(temp_list)      # Convert back
# print("Tuple after removing 20:", t)

# 37. Write a Python program to convert a tuple to a string.
# Tuple
# t = ('H', 'e', 'l', 'l', 'o')

# # Method 1: Using join()
# s = ''.join(t)
# print("String:", s)
# # Method 2: Using a loop
# s2 = ''
# for ch in t:
#     s2 += ch
# print("String (using loop):", s2)

# 38. Implement a Python program to merge two tuples.
# Two tuples
# t1 = (1, 2, 3)
# t2 = (4, 5, 6)
# # Merge using + operator
# merged = t1 + t2
# print("Merged Tuple:", merged)

# 39. Write a Python program to find the index of an element in a tuple.
# Tuple
# t = (10, 20, 30, 40, 50)
# # Element to find
# element = int(input("Enter element to find index: "))
# # Check if element exists and get index
# if element in t:
#     idx = t.index(element)
#     print(f"Index of {element} is: {idx}")
# else:
#     print(f"{element} is not in the tuple")

# 40. Implement a Python program to find the maximum and minimum elements in a tuple.
# Tuple
# t = (10, 20, 5, 40, 15)
# # Maximum element
# max_element = max(t)
# # Minimum element
# min_element = min(t)
# print("Maximum element:", max_element)
# print("Minimum element:", min_element)



# ******************************************************************************************************************
### Unit-III: Dictionaries and Functions (20 Questions)

# 41. Write a program to create a dictionary and display its keys and values.
# d = {"a": 1, "b": 2, "c": 3}
# print("Keys:", d.keys())
# print("Values:", d.values())

# 42. Implement a program to merge two dictionaries.
# d1 = {"a": 1, "b": 2}
# d2 = {"c": 3, "d": 4}
# d1.update(d2)
# print("Merged Dictionary:", d1)

# 43. Write a program to check if a key exists in a dictionary.
# d = {"a": 1, "b": 2}
# key = "b"
# print(f"{key} exists:", key in d)

# 44. Implement a Python program to sort a dictionary by its keys.
# d = {"b": 2, "a": 1, "c": 3}
# sorted_d = dict(sorted(d.items()))
# print(sorted_d)

# 45. Write a Python program to find the sum of all values in a dictionary.
# d = {"a": 1, "b": 2, "c": 3}
# print("Sum of values:", sum(d.values()))

# 46. Implement a program to create a dictionary from two lists.
# keys = ["a","b","c"]
# values = [1,2,3]
# d = dict(zip(keys, values))
# print(d)

# 47. Write a Python program to remove a key from a dictionary.
# d = {"a":1,"b":2,"c":3}
# d.pop("b", None)
# print(d)

# 48. Implement a Python program to demonstrate nested dictionaries.
# d = {"emp1":{"name":"Alice","age":25},"emp2":{"name":"Bob","age":30}}
# print(d)

# 49. Write a program to count the frequency of each word in a string using a dictionary.
# s = "hello world hello"
# freq = {}
# for w in s.split():
#     freq[w] = freq.get(w,0)+1
# print(freq)

# 50. Implement a Python program to find the maximum and minimum values in a dictionary.
# d = {"a":1,"b":5,"c":3}
# print("Max:", max(d.values()), "Min:", min(d.values()))

# 51. Write a program to demonstrate the use of a user-defined function.
# def greet(name):
#     return f"Hello {name}"
# print(greet("Aditya"))

# 52. Implement a Python program to calculate the power of a number using recursion.
# def power(a,b):
#     return 1 if b==0 else a*power(a,b-1)
# print(power(2,3))

# 53. Write a program to demonstrate the use of default arguments in a function.
# def greet(name="Guest"):
#     return f"Hello {name}"
# print(greet())
# print(greet("Aditya"))

# 54. Implement a Python program to return multiple values from a function.
# def calc(a,b):
#     return a+b, a*b
# sum_val, mul_val = calc(2,3)
# print(sum_val, mul_val)

# 55. Write a Python program to demonstrate the use of lambda functions.
# square = lambda x: x*x
# print(square(5))

# 56. Implement a program to find the GCD of two numbers using a function.
# def gcd(a,b):
#     return a if b==0 else gcd(b,a%b)
# print(gcd(12,18))

# 57. Write a Python program to find the factorial of a number using recursion.
# def fact(n):
#     return 1 if n==0 else n*fact(n-1)
# print(fact(5))

# 58. Implement a Python program to demonstrate the use of local and global variables.
# x = 10  # global
# def func():
#     y = 5  # local
#     print("Local:",y)
#     print("Global:",x)
# func()

# 59. Write a program to calculate the sum of a list of numbers using a function.
# def sum_list(lst):
#     return sum(lst)
# print(sum_list([1,2,3,4]))

# 60. Implement a Python program to demonstrate anonymous functions.
# nums = [1,2,3,4]
# squared = list(map(lambda x: x*x, nums))
# print(squared)







# ******************************************************************************************************************
# Unit-IV: Modules and File Handling (20 Questions)

# 61. Write a Python program to import the math module and calculate the area of a circle.
# import math
# r = float(input("Radius: "))
# area = math.pi * r**2
# print("Area:", area)

# 62. Implement a program to generate a random number using the random module.
# import random
# print("Random number:", random.randint(1,100))

# 63. Write a program to demonstrate the use of the time module.
# import time
# print("Current time:", time.ctime())
# time.sleep(2)
# print("After 2 seconds:", time.ctime())

# 64. Implement a Python program to create a package and use it in a program.
# # Assume package 'mypkg' with module 'mod.py' containing:
# # def hello(): print("Hello from package")
# from mypkg.mod import hello
# hello()

# 65. Write a Python program to print the contents of a file.
# with open("file.txt") as f:
#     print(f.read())

# 66. Implement a Python program to count the number of lines in a file.
# with open("file.txt") as f:
#     print("Number of lines:", sum(1 for _ in f))

# 67. Write a program to append data to a file and display the updated file contents.
# with open("file.txt","a") as f:
#     f.write("\nAppended line")
# with open("file.txt") as f:
#     print(f.read())

# 68. Implement a Python program to write a list of numbers to a file.
# numbers = [1,2,3,4,5]
# with open("numbers.txt","w") as f:
#     f.write("\n".join(map(str,numbers)))

# 69. Write a program to read data from a CSV file.
# import csv
# with open("data.csv") as f:
#     reader = csv.reader(f)
#     for row in reader:
#         print(row)

# 70. Implement a Python program to find the size of a file in bytes.
# import os
# print("File size:", os.path.getsize("file.txt"), "bytes")

# 71. Write a program to create a text file and write user input to it.
# text = input("Enter text: ")
# with open("newfile.txt","w") as f:
#     f.write(text)

# 72. Implement a Python program to copy the contents of one file to another.
# with open("file1.txt") as f1, open("file2.txt","w") as f2:
#     f2.write(f1.read())

# 73. Write a program to read a file line by line.
# with open("file.txt") as f:
#     for line in f:
#         print(line.strip())

# 74. Implement a Python program to demonstrate the use of os module methods for file handling.
# import os
# print("Current dir:", os.getcwd())
# print("List files:", os.listdir())

# 75. Write a program to create a directory and list its contents.
# import os
# os.makedirs("testdir", exist_ok=True)
# print("Contents:", os.listdir())

# 76. Implement a Python program to delete a file.
# import os
# os.remove("file_to_delete.txt")

# 77. Write a Python program to find the most frequently occurring word in a file.
# from collections import Counter
# with open("file.txt") as f:
#     words = f.read().split()
# print("Most frequent word:", Counter(words).most_common(1)[0][0])

# 78. Implement a Python program to merge the contents of two files.
# with open("file1.txt") as f1, open("file2.txt") as f2, open("merged.txt","w") as f:
#     f.write(f1.read() + "\n" + f2.read())

# 79. Write a program to read and display the first n lines of a file.
# n = int(input("Number of lines: "))
# with open("file.txt") as f:
#     for i, line in enumerate(f):
#         if i>=n: break
#         print(line.strip())

# 80. Implement a Python program to replace all occurrences of a word in a file.
# old = "oldword"
# new = "newword"
# with open("file.txt") as f:
#     data = f.read()
# data = data.replace(old,new)
# with open("file.txt","w") as f:
#     f.write(data)



# **************************************************************************************************************************
# Unit-V: Exception Handling and OOPs (20 Questions)

# 81. Write a Python program to demonstrate the use of try and except.
# try:
#     x = int(input("Enter number: "))
#     print("100/x =", 100/x)
# except ZeroDivisionError:
#     print("Cannot divide by zero")

# 82. Implement a program to demonstrate the use of finally in exception handling.
# try:
#     x = int(input("Enter number: "))
#     print(10/x)
# except ZeroDivisionError:
#     print("Error: divide by zero")
# finally:
#     print("This always executes")

# 83. Write a Python program to raise a user-defined exception.
# class MyError(Exception):
#     pass

# x = -1
# if x < 0:
#     raise MyError("Negative value not allowed")

# 84. Implement a program to handle multiple exceptions.
# try:
#     x = int(input("Enter number: "))
#     print(10/x)
#     print(a)  # undefined
# except (ZeroDivisionError, NameError) as e:
#     print("Error:", e)

# 85. Write a Python program to demonstrate the use of else in exception handling.
# try:
#     x = int(input("Enter number: "))
# except ValueError:
#     print("Invalid input")
# else:
#     print("You entered:", x)

# 86. Implement a Python program to create a class and display its attributes.
# class Person:
#     name = "Aditya"
#     age = 21

# p = Person()
# print(p.name, p.age)

# 87. Write a Python program to demonstrate the concept of inheritance.
# class Parent:
#     def greet(self):
#         print("Hello from Parent")
# class Child(Parent):
#     pass

# c = Child()
# c.greet()

# 88. Implement a program to demonstrate method overloading in Python.
# class Demo:
#     def show(self, a=None):
#         print("Value:", a)
# d = Demo()
# d.show()
# d.show(10)

# 89. Write a Python program to demonstrate method overriding in Python.
# class Parent:
#     def greet(self):
#         print("Parent")
# class Child(Parent):
#     def greet(self):
#         print("Child")

# c = Child()
# c.greet()

# 90. Implement a Python program to demonstrate data hiding in a class.
# class Demo:
#     __secret = 42
#     def reveal(self):
#         return self.__secret

# d = Demo()
# print(d.reveal())

# 91. Write a Python program to create a class with a constructor.
# class Person:
#     def __init__(self, name, age):
#         self.name = name
#         self.age = age
# p = Person("Aditya",21)
# print(p.name,p.age)

# 92. Implement a Python program to create a class and calculate the area of a rectangle.
# class Rectangle:
#     def __init__(self,l,b):
#         self.l = l
#         self.b = b
#     def area(self):
#         return self.l*self.b

# r = Rectangle(5,3)
# print("Area:", r.area())

# 93. Write a Python program to demonstrate multiple inheritance.
# class A:
#     def a(self): print("A")
# class B:
#     def b(self): print("B")
# class C(A,B): pass

# c = C()
# c.a(); c.b()

# 94. Implement a Python program to demonstrate hierarchical inheritance.
# class Parent:
#     def greet(self): print("Parent")
# class Child1(Parent): pass
# class Child2(Parent): pass

# c1 = Child1(); c2 = Child2()
# c1.greet(); c2.greet()

# 95. Write a Python program to create and manipulate a list of objects.
# class Person:
#     def __init__(self,name): self.name=name
# lst = [Person("A"), Person("B")]
# for p in lst: print(p.name)

# 96. Implement a Python program to create a student management system using OOPs.
# class Student:
#     def __init__(self,id,name): self.id=id; self.name=name
#     def display(self): print(self.id,self.name)
# s1 = Student(1,"Aditya")
# s1.display()

# 97. Write a Python program to demonstrate polymorphism in Python.
# class A:
#     def greet(self): print("Hello A")
# class B:
#     def greet(self): print("Hello B")

# for obj in (A(),B()):
#     obj.greet()

# 98. Implement a Python program to demonstrate the use of abstract classes.
# from abc import ABC, abstractmethod
# class Shape(ABC):
#     @abstractmethod
#     def area(self): pass
# class Rect(Shape):
#     def __init__(self,l,b): self.l=l; self.b=b
#     def area(self): return self.l*self.b

# r = Rect(5,3)
# print(r.area())

# 99. Write a Python program to demonstrate the use of class and static methods.
# class Demo:
#     @classmethod
#     def cls_method(cls): print("Class method")
#     @staticmethod
#     def st_method(): print("Static method")

# Demo.cls_method(); Demo.st_method()

# 100. Implement a Python program to create a bank management system using OOPs concepts.
# class Bank:
#     def __init__(self,name,balance=0): self.name=name; self.balance=balance
#     def deposit(self,amt): self.balance+=amt
#     def withdraw(self,amt): self.balance-=amt
#     def display(self): print(self.name,self.balance)

# b = Bank("Aditya",1000)
# b.deposit(500); b.withdraw(200)
# b.display()




"""
bank_system.py
Simple Bank Management System using OOP + JSON persistence
Author: Annu (for Aditya) 💗
"""

# import json
# import os
# from datetime import datetime

# DB_FILE = "accounts.json"


# # ----------------- Exceptions -----------------
# class InsufficientFunds(Exception):
#     pass


# class AccountNotFound(Exception):
#     pass


# # ----------------- Account Class -----------------
# class Account:
#     def __init__(self, acc_no: int, name: str, balance: float = 0.0):
#         self.acc_no = acc_no
#         self.name = name
#         self.balance = float(balance)
#         self.transactions = []  # list of (timestamp, type, amount, note)

#     def deposit(self, amount: float, note: str = "Deposit"):
#         if amount <= 0:
#             raise ValueError("Deposit amount must be positive.")
#         self.balance += amount
#         self._add_txn("DEPOSIT", amount, note)

#     def withdraw(self, amount: float, note: str = "Withdrawal"):
#         if amount <= 0:
#             raise ValueError("Withdrawal amount must be positive.")
#         if amount > self.balance:
#             raise InsufficientFunds("Not enough balance.")
#         self.balance -= amount
#         self._add_txn("WITHDRAW", amount, note)

#     def _add_txn(self, ttype: str, amount: float, note: str = ""):
#         self.transactions.append({
#             "time": datetime.now().isoformat(),
#             "type": ttype,
#             "amount": amount,
#             "note": note,
#             "balance": self.balance
#         })

#     def to_dict(self):
#         return {
#             "acc_no": self.acc_no,
#             "name": self.name,
#             "balance": self.balance,
#             "transactions": self.transactions
#         }

#     @staticmethod
#     def from_dict(d):
#         a = Account(d["acc_no"], d["name"], d.get("balance", 0.0))
#         a.transactions = d.get("transactions", [])
#         return a

#     def __str__(self):
#         return f"Account({self.acc_no}) | {self.name} | Balance: {self.balance:.2f}"


# # ----------------- Bank Class -----------------
# class Bank:
#     def __init__(self, db_file=DB_FILE):
#         self.db_file = db_file
#         self.accounts = {}  # acc_no -> Account
#         self._next_acc_no = 1001
#         self.load()

#     def load(self):
#         if not os.path.exists(self.db_file):
#             self.save()  # create empty DB
#             return
#         try:
#             with open(self.db_file, "r") as f:
#                 data = json.load(f)
#             accs = data.get("accounts", [])
#             self.accounts = {a["acc_no"]: Account.from_dict(a) for a in accs}
#             self._next_acc_no = data.get("next_acc_no", max(self.accounts.keys(), default=1000) + 1)
#         except (json.JSONDecodeError, IOError):
#             # recover with empty DB
#             self.accounts = {}
#             self._next_acc_no = 1001
#             self.save()

#     def save(self):
#         data = {
#             "next_acc_no": self._next_acc_no,
#             "accounts": [a.to_dict() for a in self.accounts.values()]
#         }
#         with open(self.db_file, "w") as f:
#             json.dump(data, f, indent=2)

#     def create_account(self, name: str, initial_deposit: float = 0.0) -> Account:
#         if initial_deposit < 0:
#             raise ValueError("Initial deposit cannot be negative.")
#         acc = Account(self._next_acc_no, name, initial_deposit)
#         if initial_deposit > 0:
#             acc._add_txn("DEPOSIT", initial_deposit, "Initial deposit")
#         self.accounts[acc.acc_no] = acc
#         self._next_acc_no += 1
#         self.save()
#         return acc

#     def get_account(self, acc_no: int) -> Account:
#         acc = self.accounts.get(acc_no)
#         if not acc:
#             raise AccountNotFound(f"Account {acc_no} not found.")
#         return acc

#     def deposit(self, acc_no: int, amount: float, note: str = ""):
#         acc = self.get_account(acc_no)
#         acc.deposit(amount, note or "Deposit")
#         self.save()

#     def withdraw(self, acc_no: int, amount: float, note: str = ""):
#         acc = self.get_account(acc_no)
#         acc.withdraw(amount, note or "Withdrawal")
#         self.save()

#     def transfer(self, from_acc: int, to_acc: int, amount: float):
#         if amount <= 0:
#             raise ValueError("Transfer amount must be positive.")
#         src = self.get_account(from_acc)
#         dst = self.get_account(to_acc)
#         if src.acc_no == dst.acc_no:
#             raise ValueError("Cannot transfer to the same account.")
#         # Withdraw then deposit (atomic enough for this simple app)
#         src.withdraw(amount, f"Transfer to {to_acc}")
#         dst.deposit(amount, f"Transfer from {from_acc}")
#         self.save()

#     def delete_account(self, acc_no: int):
#         if acc_no in self.accounts:
#             del self.accounts[acc_no]
#             self.save()
#         else:
#             raise AccountNotFound(f"Account {acc_no} not found.")

#     def list_accounts(self):
#         return list(self.accounts.values())

#     def show_account_statement(self, acc_no: int):
#         acc = self.get_account(acc_no)
#         print(f"\n--- Statement for {acc.name} ({acc.acc_no}) ---")
#         for t in acc.transactions:
#             ttime = t["time"]
#             ttype = t["type"]
#             amt = t["amount"]
#             note = t.get("note", "")
#             bal = t.get("balance", 0)
#             print(f"{ttime} | {ttype:8} | {amt:8.2f} | bal: {bal:8.2f} | {note}")
#         print(f"Current Balance: {acc.balance:.2f}\n")


# # ----------------- CLI Interface -----------------
# def clear_screen():
#     os.system("cls" if os.name == "nt" else "clear")


# def main_menu():
#     bank = Bank()
#     MENU = """
# Welcome to MiniBank 💗
# 1. Create Account
# 2. View Account
# 3. Deposit
# 4. Withdraw
# 5. Transfer
# 6. Account Statement
# 7. List All Accounts
# 8. Delete Account
# 9. Exit
# Choose (1-9): """
#     while True:
#         try:
#             choice = input(MENU).strip()
#             if choice == "1":
#                 name = input("Customer name: ").strip()
#                 dep = float(input("Initial deposit (0 for none): ") or 0)
#                 acc = bank.create_account(name, dep)
#                 print("Account created:", acc)
#             elif choice == "2":
#                 acc_no = int(input("Account no: "))
#                 acc = bank.get_account(acc_no)
#                 print(acc)
#             elif choice == "3":
#                 acc_no = int(input("Account no: "))
#                 amt = float(input("Amount to deposit: "))
#                 bank.deposit(acc_no, amt)
#                 print("Deposited.")
#             elif choice == "4":
#                 acc_no = int(input("Account no: "))
#                 amt = float(input("Amount to withdraw: "))
#                 bank.withdraw(acc_no, amt)
#                 print("Withdrawn.")
#             elif choice == "5":
#                 src = int(input("From account no: "))
#                 dst = int(input("To account no: "))
#                 amt = float(input("Amount: "))
#                 bank.transfer(src, dst, amt)
#                 print("Transfer successful.")
#             elif choice == "6":
#                 acc_no = int(input("Account no: "))
#                 bank.show_account_statement(acc_no)
#             elif choice == "7":
#                 accs = bank.list_accounts()
#                 if not accs:
#                     print("No accounts found.")
#                 else:
#                     print("\nAccounts:")
#                     for a in accs:
#                         print(a)
#                     print()
#             elif choice == "8":
#                 acc_no = int(input("Account no to delete: "))
#                 confirm = input("Type 'YES' to confirm: ")
#                 if confirm == "YES":
#                     bank.delete_account(acc_no)
#                     print("Deleted.")
#                 else:
#                     print("Aborted.")
#             elif choice == "9":
#                 print("Goodbye! 💗")
#                 break
#             else:
#                 print("Invalid choice.")
#         except ValueError as ve:
#             print("Value error:", ve)
#         except InsufficientFunds as ie:
#             print("Transaction failed:", ie)
#         except AccountNotFound as anfe:
#             print("Error:", anfe)
#         except Exception as e:
#             print("Unexpected error:", e)


# if __name__ == "__main__":
#     main_menu()
