// 7. **Pass/Fail:** Input marks; check if Pass ( $\ge$ 33) or Fail.

import java.util.*;

class Result {
    int marks;

    Result(int marks) {
        if (marks < 0 || marks > 100) {
            throw new IllegalArgumentException("Marks must be between 0 and 100.");
        }
        this.marks = marks;
    }

    void checkResult() {
        System.out.println(marks >= 33 ? "Pass" : "Fail");
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter marks: ");
        int marks = sc.nextInt();
        sc.close();

        try {
            Result student = new Result(marks);
            student.checkResult();
        } catch (IllegalArgumentException e) {
            System.out.println(e.getMessage());
        }
    }
}