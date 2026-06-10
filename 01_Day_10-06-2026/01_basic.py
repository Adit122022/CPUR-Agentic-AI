# print("Hello")
# print("World")

# i want it into same line 

# print("Hello", end=" ") # end means backspace or just same print as in pyhton
# print("World")


# print \n and \t
# print("\\n")
# print("\\t")

# python provides raw string to avoid escaping characters
# print(r"\n")

# print using sep=""
# print("10", "06", "2026", sep=chr(92))

# print your name , rooll no. , age , date , subject , college in same line with space in between
# print("Name: Aditya Sharma", "Roll No: k26798", "Age: 22", "Date: 10-06-2026", "Subject: Python", "College: Career point University", sep="\n")

str ="Aditya"
# dir - directory - it will show all the attributes and methods of a module or class
# print(dir(str)) #  ye sab bata dega 
# help(str) # ye sab ke baare me detail me bata dega
print(str.__doc__) # ye docstring ko print karega