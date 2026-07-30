import java.util.*;
class LinearSearch {
    int[] arr;
    int key;

    LinearSearch(int[] arr, int key) {
        this.arr = arr;
        this.key = key;
    }

    void search() {
        for(int i = 0; i < arr.length; i++) {
            if(arr[i] == key) {
                System.out.println("Element found at index: " + i);
                return;
            }
        }
        System.out.println("Element not found");
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
         System.out.print("Enter searching element: ");
        int s = sc.nextInt();

        sc.close();

        LinearSearch obj = new LinearSearch(arr ,s);
        obj.search();
    }
}