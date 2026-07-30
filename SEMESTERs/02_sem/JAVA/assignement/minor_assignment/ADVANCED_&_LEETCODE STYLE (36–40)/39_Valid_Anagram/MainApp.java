import java.util.*;

class ValidAnagram {
    String s1, s2;

    ValidAnagram(String s1, String s2) {
        this.s1 = s1;
        this.s2 = s2;
    }

    void check() {
        if (s1.length() != s2.length()) {
            System.out.println("Not Anagram");
            return;
        }

        char[] arr1 = s1.toCharArray();
        char[] arr2 = s2.toCharArray();

        Arrays.sort(arr1);
        Arrays.sort(arr2);

        if (Arrays.equals(arr1, arr2))
            System.out.println("Anagram");
        else
            System.out.println("Not Anagram");
    }
}

public class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.print("Enter first string: ");
        String s1 = sc.nextLine();

        System.out.print("Enter second string: ");
        String s2 = sc.nextLine();
        sc.close();

        ValidAnagram obj = new ValidAnagram(s1, s2);
        obj.check();
    }
}