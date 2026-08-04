// 28. **Array Sum & Average:** Input $N$ elements into an array; find sum and average.

import java.util.*;

class ArrayStats {
    int[] arr;

    ArrayStats(int[] arr) {
        this.arr = arr;
    }

    void calculate() {
        int sum = 0;
        for(int num : arr) {
            sum += num;
        }

        double avg = (double) sum / arr.length;

        System.out.println("Sum: " + sum);
        System.out.println("Average: " + avg);
    }
}
class MainApp {
    public static void main(String[] args) {

        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = sc.nextInt();

        int[] arr = new int[n];

        System.out.println("Enter elements:");
        for(int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        sc.close();

        ArrayStats obj = new ArrayStats(arr);
        obj.calculate();
    }
}