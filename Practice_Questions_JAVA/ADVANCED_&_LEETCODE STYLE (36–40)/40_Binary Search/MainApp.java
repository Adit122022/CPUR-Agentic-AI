import java.util.*;

class BinarySearch {
    int[] arr;
    int key;

    BinarySearch(int[] arr, int key) {
        this.arr = arr;
        this.key = key;
    }

    void search() {
        int left = 0, right = arr.length - 1;

        while (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] == key) {
                System.out.println("Element found at index: " + mid);
                return;
            }

            if (arr[mid] < key)
                left = mid + 1;
            else
                right = mid - 1;
        }

        System.out.println("Element not found");
    }
}

public class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size (sorted array): ");
        int n = sc.nextInt();

        int[] arr = new int[n];
        System.out.println("Enter sorted elements:");
        for (int i = 0; i < n; i++)
            arr[i] = sc.nextInt();

        System.out.print("Enter key: ");
        int key = sc.nextInt();
        sc.close();

        BinarySearch obj = new BinarySearch(arr, key);
        obj.search();
    }
}