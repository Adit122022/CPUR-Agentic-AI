"""
Day-02 Project
UNIVERSITY MANAGEMENT SYSTEM
Project Statement
==================================================
 UNIVERSITY MANAGEMENT SYSTEM
==================================================
Enter Student Name : asif
Enter Roll Number : 123
===== MENU =====
1. Result Calculator
2. Attendance Checker
3. Scholarship Checker
Enter Your Choice : 1
===== RESULT CALCULATOR =====
Enter Python Marks : 78
Enter Maths Marks : 56
Enter English Marks : 76

"""
def Result():
    print("===== RESULT CALCULATOR =====")
    python=int(input("Enter Python Marks : "))
    maths=int(input("Enter Maths Marks : "))
    english=int(input("Enter English Marks : "))
    total=python+maths+english
    percentage=total/3
    print("===== RESULT CARD =====")
    print("Name : ",name)
    print("Roll Number : ",roll)
    print("Total Marks : ",total)
    print("Percentage : ",percentage)
    if percentage>=90:
        print("Grade : A")
    elif percentage>=80:
        print("Grade : B")
    elif percentage>=70:
        print("Grade : C")
    elif percentage>=60:
        print("Grade : D")
    else:
        print("Grade : F")

def Attendance():
    print("===== ATTENDANCE CHECKER =====")
    attendance=int(input("Enter Attendance Percentage : "))
    if attendance>=60:
        print("Eligible for Exam")
    else:
        print("Not Eligible for Exam")

def Scholarship():
    print("===== SCHOLARSHIP CHECKER =====")
    attendance=int(input("Enter Attendance Percentage : "))
    percentage=int(input("Enter Percentage : "))
    if attendance>=75 and percentage>=80:
        print("Eligible for Scholarship")
    else:
        print("Not Eligible for Scholarship")

name = input("Enter Name :")
roll_no = int(input("Enter Roll Number :"))

print("===== MENU =====")
print("1. Result Calculator")
print("2. Attendance Checker")
print("3. Scholarship Checker")

ch=int(input("Enter Your Choice : "))
if ch==1:
    Result()
elif ch==2:
    Attendance()
elif ch==3:
    Scholarship()
else:
    print("Invalid Choice")

