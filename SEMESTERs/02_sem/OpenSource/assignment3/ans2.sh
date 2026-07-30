#!/bin/bash

read -p "Enter Number of Subjects :" n
sum=0
for((i=1;i<=n;i++));do
	read -p "Enter marks for Subject $i : " marks
	sum=$((marks+sum))
done
echo "Total Marks : $sum"
avg=$((sum/n))
echo "Average : $avg"

if [ $avg -ge 90 ] ;then
 grade="A"
elif [ $avg -ge 75 ] ;then
 grade="B"
elif [ $avg -ge 50 ] ;then
grade="C"
else 
 grade="F"
fi
echo "Student Grade :$grade"

