// 9. **Leap Year:** Input a year; check if it is a Leap Year.

import java.util.*;

class LeapYear {
    int year;

    LeapYear(int year) {
        if (year > 0) {
            this.year = year;
        } else {
            this.year = 0;
        }
    }

    void checkLeapYear() {
        if (year == 0) {
            System.out.println("Invalid Year");
            return;
        }

        if ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0)) {
            System.out.println("Leap Year");
        } else {
            System.out.println("Not a Leap Year");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter year: ");
        int year = sc.nextInt();
        sc.close();

        LeapYear obj = new LeapYear(year);
        obj.checkLeapYear();
    }
}