import java.util.ArrayList;
import java.util.List;

public class UserRepository {
    private final List<User> users = new ArrayList<>();

    public UserRepository() {
        users.add(new User(1, "Aditya", "aditya@example.com"));
        users.add(new User(2, "Riya", "riya@example.com"));
    }

    public void fetchUsers(DataCallback callback) {
        try {
            if (users.isEmpty()) {
                throw new IllegalStateException("No users available");
            }
            callback.onSuccess(new ArrayList<>(users));
        } catch (Exception exception) {
            callback.onError(exception.getMessage());
        }
    }
}
