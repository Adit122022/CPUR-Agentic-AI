
---

### 🟢 LEVEL 1: BASICS & CONDITIONALS (1–10)

*Focus: Arithmetic, Math class, and `if-else` logic.*

1. **Circle Geometry:** Input radius; calculate Area and Circumference.
2. **Temperature Converter:** Input Celsius; convert to Fahrenheit.
3. **Simple Interest:** Input P, R, T; calculate Interest and Total Amount.
4. **Even/Odd:** Input a number; check if it is Even or Odd.
5. **Voting Eligibility:** Input age; check if the user can vote (Age $\ge$ 18).
6. **Largest of Two:** Input two numbers; find the greater one.
7. **Pass/Fail:** Input marks; check if Pass ( $\ge$ 33) or Fail.
8. **Vowel/Consonant:** Input a character; check if it is a Vowel or Consonant.
9. **Leap Year:** Input a year; check if it is a Leap Year.
10. **Electricity Bill:** Input units; calculate bill (0-100: $5/u, 101-200: $7/u, >200: $10/u).

---

### 🟡 LEVEL 2: LOOPS & NUMBER LOGIC (11–25)

*Focus: `for/while` loops and digit manipulation.*

11. **Multiplication Table:** Input $N$; print its table up to 10.
12. **Factorial:** Input $N$; find the factorial ($N!$).
13. **Fibonacci Series:** Input $N$; print the first $N$ terms of the series.
14. **Prime Number:** Input $N$; check if it is a Prime Number.
15. **Sum of Digits:** Input a number; calculate the sum of its digits (e.g., $123 \rightarrow 6$).
16. **Reverse Number:** Input a number; print it in reverse (e.g., $123 \rightarrow 321$).
17. **Palindrome Number:** Check if the number and its reverse are the same.
18. **Armstrong Number:** Check if the sum of cubes of digits equals the number ($153 = 1^3+5^3+3^3$).
19. **Perfect Number:** Check if the sum of divisors (excluding itself) equals the number.
20. **Power Calculation:** Input base and exponent; calculate $base^{exponent}$ without `Math.pow`.
21. **Second Largest:** Input three numbers; find the second-largest number.
22. **Factors of a Number:** Print all factors of a given number.
23. **GCD/HCF:** Input two numbers; find their Greatest Common Divisor.
24. **Number to Binary:** Convert a decimal number to its binary string.
25. **Spy Number:** Check if the sum of digits equals the product of digits (e.g., 1124).

---

### 🟠 LEVEL 3: PATTERNS, ARRAYS & RECURSION (26–35)

*Focus: Logic visualization and data structures.*

26. **Right Triangle Pattern:** Print a star pattern for $N$ rows.
27. **Inverted Pyramid:** Print a centered inverted pyramid of stars.
28. **Array Sum & Average:** Input $N$ elements into an array; find sum and average.
29. **Min/Max in Array:** Find the smallest and largest element in an array.
30. **Linear Search:** Check if a specific element exists in the array.
31. **Array Sorting (Bubble Sort):** Sort an array in ascending order.
32. **Frequency of Elements:** Count how many times each number appears in an array.
33. **Recursive Factorial:** Solve factorial using a recursive method.
34. **Recursive Fibonacci:** Find the $N^{th}$ Fibonacci number using recursion.
35. **String Reverse:** Reverse a string using a loop or recursion.

---

### 🔴 LEVEL 4: ADVANCED & LEETCODE STYLE (36–40)

*Focus: Complexity and efficient problem solving.*

36. **Two Sum:** Given an array and a target, find indices of two numbers that add up to the target.
37. **Move Zeroes:** Move all 0's in an array to the end while maintaining the order of other elements.
38. **Contains Duplicate:** Check if any value appears at least twice in an array.
39. **Valid Anagram:** Check if two strings are anagrams of each other.
40. **Binary Search:** Implement an efficient search on a sorted array.

---

### Example Template (Armstrong Number)

Following your requested format, here is how you should solve these:

```java
import java.util.Scanner;

class ArmstrongChecker {
    int num;

    // Parameterized Constructor
    ArmstrongChecker(int num) {
        this.num = num;
    }

    void check() {
        int original = num, result = 0, remainder;
        while (original != 0) {
            remainder = original % 10;
            result += Math.pow(remainder, 3);
            original /= 10;
        }

        if (result == num)
            System.out.println(num + " is an Armstrong number.");
        else
            System.out.println(num + " is not an Armstrong number.");
    }
}

class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a number: ");
        int n = sc.nextInt();

        // Object creation with parameterized constructor
        ArmstrongChecker obj = new ArmstrongChecker(n);
        obj.check();
        
        sc.close();
    }
}

```

Would you like me to provide the code for the **Sorting** or **Recursion** questions next?