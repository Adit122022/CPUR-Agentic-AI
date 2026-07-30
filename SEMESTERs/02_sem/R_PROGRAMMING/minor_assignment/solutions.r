#1.Write a R program to concatenate a vector.

#1. Concatenate a vector
v1 <- c(1, 2, 3, 4, 5)
v2 <- c(3, 4, 5, 6, 7)

# Concatenate them into one
combined_vector <- c(v1, v2)
print(combined_vector)


#2.Write a R program to access the last value in a given vector.
print(v1[length(v1)])

#3. Write a R program to find common elements from multiple vectors.
cat("Common in vector :",intersect(v1, v2))


# 4. Repeat "A", "B" ten times
repeated_vec <- rep(c("A", "B"), times = 10)
print(repeated_vec)


# 5. Check the number of elements
print(length(v1))


# 6. Filtering Stock Levels
stock <- c(50, 0, 100, -5, 20, 0, 35)
# a. Create a logical filter (returns TRUE or FALSE for each element)
filter <- stock > 0
# b. Create valid_stock using the filter
valid_stock <- stock[filter]
sum(stock[filter])
valid_stock

# c. Calculate the median
stock_median <- median(valid_stock)

print(valid_stock)
print(stock_median)

# 7. Handling Missing Data (NA)
temps <- c(22.5, 23.0, NA, 21.5, 24.0, NA, 22.0)

# a. Check which elements are missing
missing_check <- is.na(temps)
print(missing_check) 

# b. Calculate average (mean)
avg_temp <- mean(temps, na.rm = TRUE)
print(avg_temp)

#8 .Following are grades of students grades <- c(85, 92, 78, 88, 95) The professor decides to add a "curve" to the grades.
#Create the vector of grades
grades <- c(99, 92, 78, 88, 95)

#a. Add 5 points to every student's grade.
# Add 5 points to every grade
curved_grades <- grades + 5
curved_grades

#b. After adding the points, cap the maximum score at 100. (i.e., if a grade is 103, it should become 100). 
# Cap the maximum score at 100
final_grades <- pmin(curved_grades, 100)

# Display results
print(final_grades)



#9.Create a 3x3 array representing a marks sheet for 3 students across 3 subjects. Then:
  #a. Calculate the total marks of each student (row sum)
  #b. Calculate the class average per subject (column mean)
  #c. Find the student with the highest total

# a. Create a 3x3 matrix (3 students, 3 subjects)
# Rows = Students, Columns = Subjects (Maths, Science, English)
marks <- matrix(c(85, 61, 84,  # Student 1
                  72, 88, 95,  # Student 2
                  4, 5.2, 0.5), # Student 3
                nrow = 3 , byrow = TRUE)

# names for clarity
rownames(marks) <- c("Aditya", "Bharat", "Unnati")
colnames(marks) <- c("Maths", "Science", "English")
marks

# a. Calculate total marks of each student (Row Sums)
student_totals <- rowSums(marks)
print(student_totals)

# b. Calculate class average per subject (Column Means)
subject_averages <- round(colMeans(marks),2)
print(subject_averages)

# c. Find the student with the highest total
top_student_name <- names(which.max(student_totals))
print(paste("The student with the highest total is:", top_student_name))


#10. Create a function in R that prints square of first five prime numbers
library(numbers) #install.packages("numbers")
print_prime_squares <- function(n){
 prime <- Primes(1,100)[1:n]
cat("Squares of starting  6 prime numbers :",prime^2)
}
print_prime_squares(2)


