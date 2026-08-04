// 21. **Second Largest:** Input three numbers; find the second-largest number.
import java.util.*;

class SecondLargestArray {
    int[] arr;

    SecondLargestArray(int[] arr) {
        this.arr = arr;
    }

    void findSecondLargest() {
        if (arr.length < 2) {
            System.out.println("Not enough elements");
            return;
        }

        int largest = Integer.MIN_VALUE;
        int second = Integer.MIN_VALUE;

        for (int num : arr) {
            if (num > largest) {
                second = largest;
                largest = num;
            } else if (num > second && num != largest) {
                second = num;
            }
        }

        if (second == Integer.MIN_VALUE) {
            System.out.println("No second largest element");
        } else {
            System.out.println("Second Largest: " + second);
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size of array: ");
        int n = sc.nextInt();

        int[] arr = new int[n];

        System.out.println("Enter elements (ONLY INTEGER NOT DECIMAL OR FLOAT VALUE):");
        for (int i = 0; i < n; i++) {
            arr[i] = sc.nextInt();
        }

        sc.close();

        SecondLargestArray obj = new SecondLargestArray(arr);
        obj.findSecondLargest();
    }
}