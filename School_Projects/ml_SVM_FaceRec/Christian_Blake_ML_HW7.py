# Copyright 2024 Christian Blake
# sources: https://scikit-learn.org/stable/auto_examples/compose/plot_digits_pipe.html

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import fetch_lfw_pairs
from sklearn.svm import SVC
from sklearn.metrics import classification_report, ConfusionMatrixDisplay
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import uniform, loguniform
from sklearn.pipeline import Pipeline
from sklearn.decomposition import PCA
import warnings
from sklearn.preprocessing import StandardScaler


# Part a
# use fetch_lfw_pairs to import dataset
print("Importing LFW pairs dataset:")
lfw_pairs_train = fetch_lfw_pairs(subset='train')
lfw_pairs_test = fetch_lfw_pairs(subset='test')

# Part b
# complete dataset description
print("Dataset description:")
print("="*50)
print("Labeled Faces in the Wild (LFW) Pairs Dataset:")
print("-"*50)
print(f"Training samples shape: {lfw_pairs_train.data.shape}")
print(f"Test samples shape: {lfw_pairs_test.data.shape}")
print(f"Target shape: {lfw_pairs_train.target.shape}")
print(f"Target values: {np.unique(lfw_pairs_train.target)}")
print(f"Target distribution in training set: {np.bincount(lfw_pairs_train.target)}")
print(f"Target distribution in test set: {np.bincount(lfw_pairs_test.target)}")

print("\nDataset Information:")
print("LFW pairs dataset contains pairs of face images:")
print("- Class 0: different people with similar faces")
print("- Class 1: same person with different photos")
print("\nThe pairs of images are flattened into a feature vector.")
print("Need to determine if the two face images are the same person or not.")
print(f"Features are pixel values in images, count is: {lfw_pairs_train.data.shape[1]}")
print("="*50)

# Part c
# split data into training/test sets
print("Building training/test sets:")
X_train = lfw_pairs_train.data
t_train = lfw_pairs_train.target
X_test = lfw_pairs_test.data
t_test = lfw_pairs_test.target

print(f"X_train shape: {X_train.shape}")
print(f"t_train shape: {t_train.shape}")
print(f"X_test shape: {X_test.shape}")
print(f"t_test shape: {t_test.shape}")

# Part d
# train support vector classifier, report results
print("Training support vector classifier:")
default_svc = SVC(random_state=42)
default_svc.fit(X_train, t_train)

default_pred = default_svc.predict(X_test)
print("Classification report (default SVC):")
print("-"*50)
default_report = classification_report(t_test, default_pred)
print(default_report)

# plot confusion matrix
fig, ax = plt.subplots(figsize=(8,6))
cmd = ConfusionMatrixDisplay.from_predictions(
    t_test,
    default_pred,
    display_labels=["Different person", "Same person"],
    cmap=plt.cm.Blues,
    ax=ax
)
plt.title('Confusion Matrix - Default SVC')
plt.tight_layout()
plt.savefig('default_svc_confusion_matrix.png')
plt.close()

# Part e
# tune classifier with RandomizedSearchCV
print("Tuning classifier with RandomizedSearchCV:")

scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)


# param distribution definition
param_distributions = {
    'C': loguniform(1e-3, 1e3),
    'kernel': ['rbf'],
    'gamma': ['scale', 'auto'] + list(loguniform(1e-4, 1e0).rvs(3)),
    'class_weight': ['balanced', None]
}

# now create RSCV
random_search = RandomizedSearchCV(
    SVC(random_state=42, probability=True),
    param_distributions=param_distributions,
    n_iter=20,
    cv=5,
    scoring='balanced_accuracy',
    n_jobs=-1,
    random_state=42,
    verbose=2
)

# fit RSCV
random_search.fit(X_train_scaled, t_train)

# print best params
print("Best parameters found:")
print("-"*50)
for param, value in random_search.best_params_.items():
    print(f"{param}: {value}")

# Part f
# report results
print("Results for best classifier:")
best_svc = random_search.best_estimator_
best_pred = best_svc.predict(X_test_scaled)

print("Classification Report (Best SVC):")
print("-"*50)
best_report = classification_report(t_test, best_pred)
print(best_report)

# plot confusion matrix for best classifier
fig, ax = plt.subplots(figsize=(8,6))
cmd = ConfusionMatrixDisplay.from_predictions(
    t_test,
    best_pred,
    display_labels=["Different Person", "Same Person"],
    cmap=plt.cm.Blues,
    ax=ax
)
plt.title('Confusion Matrix - Best SVC')
plt.tight_layout()
plt.savefig('best_svc_confusion_matrix.png')
plt.close()


