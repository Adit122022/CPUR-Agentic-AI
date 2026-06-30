import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

# Step 1: Create a small dataset (Study Hours, Attendance, Previous Marks vs Pass/Fail)
# Note: Real life me hum CSV load karte hain, par demo ke liye standard dictionary use kar rahe hain.
data = {
    "Study_Hours": [6, 5, 4, 3, 2, 1, 7, 5, 4, 2],
    "Attendance": [95, 90, 85, 60, 55, 40, 98, 88, 75, 45],
    "Previous_Marks": [90, 85, 80, 50, 45, 30, 95, 82, 70, 35],
    "Pass": [1, 1, 1, 0, 0, 0, 1, 1, 1, 0]
}

df = pd.DataFrame(data)
print("--- Raw Dataset ---")
print(df)
print("\n")

# Step 2: Separate Features (Inputs) and Target Label (Output)
X = df[["Study_Hours", "Attendance", "Previous_Marks"]]
y = df["Pass"]

# Step 3: Split into Training and Testing Sets
# 80% data for training, 20% for testing
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 4: Feature Scaling (Standardization)
# DL models scaling ke bina bohot slow converge karte hain. 
# StandardScaler mean ko 0 aur variance ko 1 kar deta hai.
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 5: Define the Neural Network Architecture
# We are using Sequential API because layers stacked sequentially hain (one after another).
model = Sequential([
    # Input Layer receives 3 features. We connect it to 8 Neurons in 1st Hidden Layer.
    # 'relu' (Rectified Linear Unit) helps to add non-linearity to the model.
    Dense(8, activation="relu", input_shape=(3,)),
    
    # 2nd Hidden Layer with 4 Neurons
    Dense(4, activation="relu"),
    
    # Output Layer with 1 Neuron (Binary Classification - Pass or Fail)
    # 'sigmoid' restricts the output between 0 and 1 (represents probability).
    Dense(1, activation="sigmoid")
])

# Step 6: Compile the Model
# Optimizer: Adam (Adaptive Moment Estimation) - the golden standard optimizer.
# Loss: binary_crossentropy - since it is a binary classification (0 or 1).
# Metrics: accuracy - to track model performance.
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# Step 7: Train the Model (Epochs = 100, Batch Size = 2)
# Verbose = 1 means it will print the training logs.
print("--- Training the Neural Network ---")
model.fit(X_train_scaled, y_train, epochs=100, batch_size=2, verbose=1)
print("\n")

# Step 8: Evaluate the Model on Test Data
loss, accuracy = model.evaluate(X_test_scaled, y_test, verbose=0)
print(f"Test Loss: {loss:.4f}")
print(f"Test Accuracy: {accuracy * 100:.2f}%\n")

# Step 9: Make Prediction for a New Student
# Imagine a student with: Study Hours = 5, Attendance = 90%, Previous Marks = 82
new_student = [[5, 90, 82]]

# Critical Step: Naye data ko bhi usi scaler se scale karna zaroori hai!
new_student_scaled = scaler.transform(new_student)

prediction = model.predict(new_student_scaled)
probability = prediction[0][0]

print(f"\nPrediction Probability for new student: {probability:.4f}")
if probability >= 0.5:
    print("Result: PASS 🎉")
else:
    print("Result: FAIL ❌")
