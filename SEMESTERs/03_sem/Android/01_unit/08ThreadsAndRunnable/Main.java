public class Main {
    public static void main(String[] args) throws InterruptedException {
        System.out.println("Main thread: starting background work.");

        Thread backgroundThread = new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("Background thread: loading data...");
                System.out.println("Background thread: data loaded.");
            }
        });

        backgroundThread.start();
        System.out.println("Main thread: remains responsive.");
        backgroundThread.join();
        System.out.println("Main thread: background work finished.");
    }
}
