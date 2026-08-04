import java.util.List;

public class Main {
    public static void main(String[] args) {
        UserRepository repository = new UserRepository();

        repository.fetchUsers(new DataCallback() {
            @Override
            public void onSuccess(List<User> users) {
                System.out.println("Fetched users:");
                for (User user : users) {
                    System.out.println(user);
                }
            }

            @Override
            public void onError(String message) {
                System.out.println("Error: " + message);
            }
        });
    }
}
