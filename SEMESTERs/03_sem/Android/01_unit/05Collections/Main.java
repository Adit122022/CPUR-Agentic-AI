import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        List<User> users = new ArrayList<>();
        users.add(new User(1, "Aditya"));
        users.add(new User(2, "Riya"));

        User foundUser = findById(users, 2);
        System.out.println("Found: " + foundUser);
        users.remove(foundUser);

        for (User user : users) {
            System.out.println("Remaining user: " + user);
        }

        Map<String, Integer> productPrices = new HashMap<>();
        productPrices.put("Notebook", 50);
        productPrices.put("Pen", 10);
        System.out.println("Notebook price: " + productPrices.get("Notebook"));
    }

    private static User findById(List<User> users, int id) {
        for (User user : users) {
            if (user.getId() == id) {
                return user;
            }
        }
        return null;
    }
}
