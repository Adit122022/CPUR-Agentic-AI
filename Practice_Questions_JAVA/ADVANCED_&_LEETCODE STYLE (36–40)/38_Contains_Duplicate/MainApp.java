import java.util.*;

class ContainsDuplicate {
    int[] arr;

    ContainsDuplicate(int[] arr) {
        this.arr = arr;
    }

    void check() {
        HashSet<Integer> set = new HashSet<>();

        for (int num : arr) {
            if (set.contains(num)) {
                System.out.println("Contains Duplicate");
                return;
            }
            set.add(num);
        }

        System.out.println("No Duplicates");
    }
}

public class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter size: ");
        int n = sc.nextInt();

        int[] arr = new int[n];
        System.out.println("Enter elements:");
        for (int i = 0; i < n; i++)
            arr[i] = sc.nextInt();

        sc.close();

        ContainsDuplicate obj = new ContainsDuplicate(arr);
        obj.check();
    }
}