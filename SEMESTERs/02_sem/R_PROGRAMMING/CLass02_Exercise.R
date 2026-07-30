#Exercise:
  
  students <- data.frame(
    student_id = c(1,2,3,4,5,6),
    name = c("Amit","Neha","Raj","Simran","Karan","Pooja"),
    dept = c("CS","IT","CS","IT","CS","IT")
  )
  
  marks <- data.frame(
    student_id = c(1,2,3,4,5,6),
    subject = c("ML","DBMS","ML","DBMS","AI","AI"),
    score = c(85,90,78,88,92,75)
  )
  
  attendance <- data.frame(
    student_id = c(1,2,3,4,5,6),
    attendance_percent = c(92,85,88,90,95,80)
  )
  
  
  #Q1. Select only name and dept from students
  #Q2. Select all columns except dept
  #Q3. Arrange students in ascending order of name
  #Q4. Arrange marks in descending order of score
  #Q5. Arrange by subject and then by highest score
  #Q6. Find average score for each subject
  