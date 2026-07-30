#!/bin/bash

days=("Monday" "Tuesday" "WednesDay" "Thursday" "Friday" "Saturday")
echo "Days of the Week are : "
for day in "${days[@]}";do
	echo "-$day"
done
