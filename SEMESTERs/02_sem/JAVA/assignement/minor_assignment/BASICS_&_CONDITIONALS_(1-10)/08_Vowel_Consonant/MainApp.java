//8. **Vowel/Consonant:** Input a character; check if it is a Vowel or Consonant.

import java.util.*;

class CharacterCheck {
    char ch;

    CharacterCheck(char ch) {
        if (Character.isLetter(ch)) {
            this.ch = Character.toLowerCase(ch);
        } else {
            this.ch = '0';   // invalid marker
        }
    }

    void checkVowelOrConsonant() {
        if (ch == '0') {
            System.out.println("Invalid Input");
            return;
        }

        if (ch == 'a' || ch == 'e' || ch == 'i' || ch == 'o' || ch == 'u') {
            System.out.println("Vowel");
        } else {
            System.out.println("Consonant");
        }
    }
}

class MainApp {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter a character: ");
        char ch = sc.next().charAt(0);
        sc.close();

        CharacterCheck obj = new CharacterCheck(ch);
        obj.checkVowelOrConsonant();
    }
}