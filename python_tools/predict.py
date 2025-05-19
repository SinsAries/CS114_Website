import sys
import joblib
import json
import numpy as np
from collections import Counter

# --- BẮT BUỘC phải copy lại class này vào predict.py ---
def add_bias(X):
  m = X.shape[0]
  bias = np.ones((m, 1))
  return np.concatenate((bias, X), axis = 1)

def one_hot(y, num_classes):
  m = y.shape[0]
  y_one_hot = np.zeros((m, num_classes))
  y_one_hot[np.arange(m), y] = 1
  return y_one_hot

def softmax(Z):
  Z = Z - np.max(Z, axis = 1, keepdims = True)
  expZ = np.exp(Z)
  return (expZ / np.sum(expZ, axis = 1, keepdims = True))

def compute_loss(Y_true, Y_pred):
  m = Y_true.shape[0]
  eps = 1e-15
  return - np.sum(Y_true * np.log(Y_pred + eps)) / m

class SoftmaxRegression:
  def __init__(self, lr=0.1, n_iters=1000):
    self.lr = lr
    self.n_iters = n_iters
    self.W = None

  def fit(self, X, y, print_loss=False):
    X = add_bias(X)
    m, d_plus_1 = X.shape
    K = np.max(y) + 1
    Y = one_hot(y, K)
    self.W = np.zeros((d_plus_1, K))
    for i in range(self.n_iters):
      Z = X.dot(self.W)
      A = softmax(Z)
      grad = X.T.dot(A - Y) / m
      self.W -= self.lr * grad
      if print_loss and i % 100 == 0:
        loss = compute_loss(Y, A)
        print(f"Iter {i:04d}   loss = {loss:.4f}")

  def predict(self, X):
    X = add_bias(X)
    A = softmax(X.dot(self.W))
    return np.argmax(A, axis=1)
# -- HẾT phần copy class --


class GaussianNaiveBayes:
    def __init__(self, eps=1e-9):
        self.eps = eps
        self.classes_ = None
        self.priors_ = None
        self.means_ = None
        self.vars_ = None

    def fit(self, X, y):
        X = np.array(X, dtype=float)
        y = np.array(y)
        n_samples, n_features = X.shape
        self.classes_, counts = np.unique(y, return_counts=True)
        n_classes = len(self.classes_)
        self.priors_ = np.zeros(n_classes)
        self.means_  = np.zeros((n_classes, n_features))
        self.vars_   = np.zeros((n_classes, n_features))
        for idx, c in enumerate(self.classes_):
            X_c = X[y == c]
            self.priors_[idx] = X_c.shape[0] / n_samples
            self.means_[idx, :] = X_c.mean(axis=0)
            self.vars_[idx, :]  = X_c.var(axis=0) + self.eps

    def _log_gaussian(self, cls_idx, x):
        mean = self.means_[cls_idx]
        var  = self.vars_[cls_idx]
        term1 = -0.5 * np.sum(np.log(2.0 * np.pi * var))
        term2 = -0.5 * np.sum((x - mean)**2 / var)
        return term1 + term2

    def predict(self, X):
        X = np.array(X, dtype=float)
        y_pred = []
        for x in X:
            log_probs = [
                np.log(self.priors_[idx]) + self._log_gaussian(idx, x)
                for idx in range(len(self.classes_))
            ]
            best_cls = self.classes_[np.argmax(log_probs)]
            y_pred.append(best_cls)
        return np.array(y_pred)

    def predict_proba(self, X):
        X = np.array(X, dtype=float)
        probs = []
        for x in X:
            log_probs = np.array([
                np.log(self.priors_[idx]) + self._log_gaussian(idx, x)
                for idx in range(len(self.classes_))
            ])
            max_lp = np.max(log_probs)
            exp_lp = np.exp(log_probs - max_lp)
            probs.append(exp_lp / exp_lp.sum())
        return np.vstack(probs)
    
class KNNClassifier:
    def __init__(self, k=5):
        """
        k: số lượng láng giềng gần nhất để bỏ phiếu
        """
        self.k = k
        self.X_train = None
        self.y_train = None

    def fit(self, X, y):
        """
        Lưu trữ dữ liệu train.
        X: DataFrame hoặc array shape (n_samples, n_features)
        y: DataFrame/Series hoặc array shape (n_samples,)
        """
        # Chuyển DataFrame/Series sang numpy array nếu cần
        if hasattr(X, "to_numpy"):
            self.X_train = X.to_numpy()
        else:
            self.X_train = np.array(X)

        if hasattr(y, "to_numpy"):
            self.y_train = y.to_numpy()
        else:
            self.y_train = np.array(y)

    def _predict_one(self, x):
        """
        Dự đoán nhãn cho 1 mẫu x (array shape (n_features,))
        """
        # tính khoảng cách Euclid tới tất cả điểm train
        distances = np.linalg.norm(self.X_train - x, axis=1)
        # lấy chỉ số k điểm có khoảng cách nhỏ nhất
        k_idx = np.argsort(distances)[:self.k]
        # lấy nhãn tương ứng
        k_labels = self.y_train[k_idx]
        # bỏ phiếu đa số
        most_common = Counter(k_labels).most_common(1)[0][0]
        return most_common

    def predict(self, X):
        """
        Dự đoán nhãn cho tất cả mẫu trong X
        X: DataFrame hoặc array shape (n_samples, n_features)
        Trả về array shape (n_samples,)
        """
        if hasattr(X, "to_numpy"):
            X = X.to_numpy()
        else:
            X = np.array(X)

        return np.array([self._predict_one(x) for x in X])

    def score(self, X, y):
        """
        Tính accuracy trên tập X, y
        """
        y_pred = self.predict(X)
        if hasattr(y, "to_numpy"):
            y = y.to_numpy()
        else:
            y = np.array(y)
        return np.mean(y_pred == y)

class DecisionTreeClassifierCustom:
    class Node:
        def __init__(self, feature_index=None, threshold=None, left=None, right=None, *, value=None):
            # feature_index: chỉ số của thuộc tính dùng để phân tách
            self.feature_index = feature_index
            # threshold: ngưỡng phân tách tại nút
            self.threshold     = threshold
            # left, right: con trái và con phải (có thể là Node hoặc lá)
            self.left          = left
            self.right         = right
            # value: giá trị nhãn dự đoán nếu node là lá
            self.value         = value

    def __init__(self, max_depth=None, min_samples_split=2):
        """
        max_depth: độ sâu tối đa của cây (None = không giới hạn)
        min_samples_split: số mẫu tối thiểu để tiếp tục phân tách
        """
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.root = None

    def fit(self, X, y):
        """
        X: np.ndarray, shape (n_samples, n_features)
        y: np.ndarray, shape (n_samples,)
        Huấn luyện cây quyết định trên dữ liệu đầu vào
        """
        # Số lượng lớp trong y
        self.n_classes_ = len(np.unique(y))
        # Xây dựng cây từ gốc
        self.root = self._build_tree(X, y)

    def _build_tree(self, X, y, depth=0):
        n_samples, n_features = X.shape
        n_labels = len(np.unique(y))

        # Điều kiện dừng:
        # - Đạt độ sâu tối đa
        # - Chỉ còn một lớp
        # - Số mẫu quá ít để phân tách
        if (self.max_depth is not None and depth >= self.max_depth) \
           or n_labels == 1 \
           or n_samples < self.min_samples_split:
            # Tạo lá với nhãn phổ biến nhất
            leaf_value = self._most_common_label(y)
            return self.Node(value=leaf_value)

        # Tìm phân tách tốt nhất tại nút này
        feat_idx, thr = self._best_split(X, y)
        # Nếu không tìm được split nào cải thiện, cũng tạo lá
        if feat_idx is None:
            leaf_value = self._most_common_label(y)
            return self.Node(value=leaf_value)

        # Chia dữ liệu thành hai tập con theo feature và threshold
        left_mask  = X[:, feat_idx] <= thr
        X_left, y_left   = X[left_mask], y[left_mask]
        X_right, y_right = X[~left_mask], y[~left_mask]

        # Đệ quy xây cây cho con trái và con phải
        left_node  = self._build_tree(X_left, y_left, depth+1)
        right_node = self._build_tree(X_right, y_right, depth+1)
        return self.Node(feature_index=feat_idx, threshold=thr,
                         left=left_node, right=right_node)

    def _best_split(self, X, y):
        """Tìm feature và ngưỡng tối ưu dựa trên Gini Gain"""
        best_gain = 0.0
        split_idx, split_thr = None, None
        parent_gini = self._gini(y)
        n_samples, n_features = X.shape

        # Duyệt qua từng feature
        for feat in range(n_features):
            # Các giá trị duy nhất để thử làm threshold
            thresholds = np.unique(X[:, feat])
            for thr in thresholds:
                left_mask = X[:, feat] <= thr
                # Bỏ qua nếu không chia được
                if left_mask.sum() == 0 or (~left_mask).sum() == 0:
                    continue

                # Tính Gini cho hai tập con
                gini_left  = self._gini(y[left_mask])
                gini_right = self._gini(y[~left_mask])
                p_left = left_mask.sum() / n_samples
                # Gini Gain
                gain = parent_gini - (p_left * gini_left + (1-p_left) * gini_right)

                # Lưu split tốt nhất
                if gain > best_gain:
                    best_gain   = gain
                    split_idx   = feat
                    split_thr   = thr
        return split_idx, split_thr

    def _gini(self, y):
        """Tính độ tạp Gini của mảng y"""
        counts = np.bincount(y)
        prob   = counts / len(y)
        return 1.0 - np.sum(prob**2)

    def _most_common_label(self, y):
        """Trả về nhãn xuất hiện nhiều nhất trong y"""
        return Counter(y).most_common(1)[0][0]

    def predict(self, X):
        """Dự đoán nhãn cho mỗi mẫu trong X"""
        return np.array([self._traverse_tree(x, self.root) for x in X])

    def _traverse_tree(self, x, node):
        """Duyệt cây để tìm nhãn dự đoán cho một mẫu x"""
        # Nếu node là lá, trả nhãn
        if node.value is not None:
            return node.value
        # Ngược lại, so sánh và đi tiếp
        if x[node.feature_index] <= node.threshold:
            return self._traverse_tree(x, node.left)
        else:
            return self._traverse_tree(x, node.right)
        
class DecisionTreeClassifierCustom:
    class Node:
        def __init__(self, feature_index=None, threshold=None, left=None, right=None, *, value=None):
            self.feature_index = feature_index
            self.threshold     = threshold
            self.left          = left
            self.right         = right
            self.value         = value

    def __init__(self, max_depth=None, min_samples_split=2, max_features=None):
        """
        max_depth: độ sâu tối đa (None = không giới hạn)
        min_samples_split: số mẫu tối thiểu để tiếp tục split
        max_features: số feature ngẫu nhiên thử tại mỗi nút (int),
                      hoặc 'sqrt' để lấy √n_features
        """
        self.max_depth         = max_depth
        self.min_samples_split = min_samples_split
        self.max_features      = max_features
        self.root              = None

    def fit(self, X, y):
        self.n_classes_ = len(np.unique(y))
        self.n_features_ = X.shape[1]
        self.root = self._build_tree(X, y)

    def _build_tree(self, X, y, depth=0):
        n_samples, _ = X.shape
        n_labels = len(np.unique(y))

        # Điều kiện dừng
        if (self.max_depth is not None and depth >= self.max_depth) \
           or n_labels == 1 \
           or n_samples < self.min_samples_split:
            leaf_value = Counter(y).most_common(1)[0][0]
            return self.Node(value=leaf_value)

        feat_idx, thr = self._best_split(X, y)
        if feat_idx is None:
            leaf_value = Counter(y).most_common(1)[0][0]
            return self.Node(value=leaf_value)

        mask_left = X[:, feat_idx] <= thr
        left = self._build_tree(X[mask_left], y[mask_left], depth+1)
        right = self._build_tree(X[~mask_left], y[~mask_left], depth+1)
        return self.Node(feature_index=feat_idx, threshold=thr, left=left, right=right)

    def _best_split(self, X, y):
        best_gain = 0.0
        split_idx, split_thr = None, None
        parent_gini = self._gini(y)
        n_samples, n_features = X.shape

        # xác định tập feature được thử
        features = np.arange(n_features)
        if isinstance(self.max_features, str) and self.max_features == 'sqrt':
            k = max(1, int(np.sqrt(n_features)))
            features = np.random.choice(features, k, replace=False)
        elif isinstance(self.max_features, int):
            k = min(self.max_features, n_features)
            features = np.random.choice(features, k, replace=False)

        for feat in features:
            thresholds = np.unique(X[:, feat])
            for thr in thresholds:
                mask_left = X[:, feat] <= thr
                if mask_left.sum() == 0 or mask_left.sum() == n_samples:
                    continue

                gini_left  = self._gini(y[mask_left])
                gini_right = self._gini(y[~mask_left])
                p_left = mask_left.sum() / n_samples
                gain = parent_gini - (p_left * gini_left + (1-p_left) * gini_right)

                if gain > best_gain:
                    best_gain, split_idx, split_thr = gain, feat, thr

        return split_idx, split_thr

    def _gini(self, y):
        counts = np.bincount(y)
        probs  = counts / len(y)
        return 1 - np.sum(probs**2)

    def predict(self, X):
        return np.array([self._traverse(x, self.root) for x in X])

    def _traverse(self, x, node):
        if node.value is not None:
            return node.value
        if x[node.feature_index] <= node.threshold:
            return self._traverse(x, node.left)
        else:
            return self._traverse(x, node.right)


class RandomForestClassifierCustom:
    def __init__(self, n_estimators=10, max_features='sqrt', max_depth=None, min_samples_split=2):
        """
        n_estimators: số cây trong rừng
        max_features: truyền xuống mỗi tree để random feature
        max_depth, min_samples_split: tham số tree
        """
        self.n_estimators = n_estimators
        self.max_features = max_features
        self.max_depth = max_depth
        self.min_samples_split = min_samples_split
        self.trees = []

    def _bootstrap(self, X, y):
        n_samples = X.shape[0]
        idxs = np.random.choice(n_samples, size=n_samples, replace=True)
        return X[idxs], y[idxs]

    def fit(self, X, y):
        self.trees = []
        for _ in range(self.n_estimators):
            X_samp, y_samp = self._bootstrap(X, y)
            tree = DecisionTreeClassifierCustom(
                max_depth=self.max_depth,
                min_samples_split=self.min_samples_split,
                max_features=self.max_features
            )
            tree.fit(X_samp, y_samp)
            self.trees.append(tree)

    def predict(self, X):
        # Mỗi cây vote
        preds = np.array([tree.predict(X) for tree in self.trees])  # shape = (n_trees, n_samples)
        # Transpose để lấy phiếu mỗi sample
        preds = preds.T  # shape = (n_samples, n_trees)
        # Đa số
        y_pred = [Counter(row).most_common(1)[0][0] for row in preds]
        return np.array(y_pred)
    
class MulticlassSVM:
    def __init__(self, learning_rate=1e-3, lambda_param=1e-4, num_iters=1000, verbose=False):
        """
        learning_rate: bước nhảy gradient
        lambda_param: hệ số regularization (C = 1/lambda_param)
        num_iters: số vòng lặp tối đa
        verbose: in loss mỗi 100 vòng
        """
        self.lr = learning_rate
        self.lambda_param = lambda_param
        self.num_iters = num_iters
        self.verbose = verbose
        self.W = None  # ma trận trọng số shape = (n_classes, n_features)

    def _loss_and_grad(self, X, y):
        """
        Tính loss và gradient theo multiclass hinge loss.
        X: (n_samples, n_features)
        y: (n_samples,) với giá trị trong [0, n_classes-1]
        """
        n_samples, n_features = X.shape
        n_classes = self.W.shape[0]

        # scores: (n_classes, n_samples)
        scores = self.W.dot(X.T)
        # lấy score đúng cho mỗi mẫu: shape (n_samples,)
        correct_scores = scores[y, np.arange(n_samples)]

        # multiclass margin: max(0, s_j - s_yi + 1)
        margins = np.maximum(0, scores - correct_scores + 1)
        margins[y, np.arange(n_samples)] = 0

        # loss = regularization + trung bình margin
        loss = 0.5 * self.lambda_param * np.sum(self.W * self.W) + np.sum(margins) / n_samples

        # gradient
        binary = (margins > 0).astype(float)  # (n_classes, n_samples)
        # với mẫu i, tổng số lớp j có margin>0:
        row_sum = np.sum(binary, axis=0)
        # đối với đúng lớp, gradient cộng -row_sum
        binary[y, np.arange(n_samples)] = -row_sum

        dW = binary.dot(X) / n_samples + self.lambda_param * self.W  # shape (n_classes, n_features)
        return loss, dW

    def fit(self, X, y):
        """
        Huấn luyện mô hình SVM đa lớp.
        X: numpy array (n_samples, n_features)
        y: numpy array (n_samples,), nhãn 0..K-1
        """
        X = np.array(X)
        y = np.array(y)
        n_samples, n_features = X.shape
        self.classes_ = np.unique(y)
        n_classes = len(self.classes_)

        # khởi tạo W nhỏ ngẫu nhiên
        self.W = 0.001 * np.random.randn(n_classes, n_features)

        # gradient descent
        for it in range(self.num_iters):
            loss, grad = self._loss_and_grad(X, y)
            self.W -= self.lr * grad
            if self.verbose and it % 100 == 0:
                print(f"Iter {it}/{self.num_iters}, loss = {loss:.4f}")

    def predict(self, X):
        """
        Dự đoán nhãn cho X.
        X: (n_samples, n_features)
        Trả về mảng (n_samples,) các nhãn 0..K-1
        """
        X = np.array(X)
        scores = self.W.dot(X.T)  # (n_classes, n_samples)
        y_pred = np.argmax(scores, axis=0)
        return y_pred

def load_model_scaler_encoder(model_name):
    model = joblib.load(f"./src/models/{model_name}.pkl")
    scaler_encoder = joblib.load("./src/models/mmscaler-labelencoder.pkl")
    return model, scaler_encoder["scaler"], scaler_encoder["label_encoder"]

def predict_disease(features, model_name):
    model, scaler, encoder = load_model_scaler_encoder(model_name)

    # print("features:", features)

    if(features[1] == 'male'):
        features[1] = 0
    else:
        features[1] = 1
    features = np.array(features).reshape(1, -1)
    features_scaled = scaler.transform(features)

    # print("features_scaled:", features_scaled)
    # if np.isnan(features_scaled).any():
    #     print("NaN detected in scaled data! Please check input feature vector.")

    pred_encoded = model.predict(features_scaled)
    pred_label = encoder.inverse_transform(pred_encoded)
    return pred_label[0]

if __name__ == "__main__":
    feature_vector = json.loads(sys.argv[1])
    model_name = sys.argv[2]

    prediction = predict_disease(feature_vector, model_name)
    print(json.dumps({"disease": prediction}))
