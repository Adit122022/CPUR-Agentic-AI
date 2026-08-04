import java.util.List;

public interface DataCallback {
    void onSuccess(List<User> list);

    void onError(String message);
}
