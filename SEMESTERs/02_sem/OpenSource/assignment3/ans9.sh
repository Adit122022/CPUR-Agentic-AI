#!/bin/bash
read -p "Enter Number a" a
read -p "Enter Number b" b

if [ "$b" -eq 0 ];then
echo "ERROR : Denominator can't be Zero"

c=$((a/b))
echo "Result : $c"
exit 0
