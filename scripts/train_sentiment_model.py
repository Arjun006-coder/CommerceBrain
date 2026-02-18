
import os
import torch
from torch.utils.data import Dataset, DataLoader
from transformers import RobertaTokenizer, RobertaForSequenceClassification, Trainer, TrainingArguments
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# Setup
MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"
DATA_PATH = "data/processed/training_sentiment.csv"
OUTPUT_DIR = "backend/models/sentiment_feature_store"

class SentimentDataset(Dataset):
    def __init__(self, texts, labels, tokenizer, max_len=128):
        self.texts = texts
        self.labels = labels
        self.tokenizer = tokenizer
        self.max_len = max_len

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, item):
        text = str(self.texts[item])
        label = self.labels[item]

        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_len,
            padding='max_length',
            truncation=True,
            return_attention_mask=True,
            return_tensors='pt',
        )

        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten(),
            'labels': torch.tensor(label, dtype=torch.long)
        }

def compute_metrics(eval_pred):
    from sklearn.metrics import accuracy_score, precision_recall_fscore_support
    logits, labels = eval_pred
    predictions = np.argmax(logits, axis=-1)
    precision, recall, f1, _ = precision_recall_fscore_support(labels, predictions, average='weighted')
    acc = accuracy_score(labels, predictions)
    return {
        'accuracy': acc,
        'f1': f1,
        'precision': precision,
        'recall': recall
    }

def train_sentiment_model():
    print(f"Loading data from {DATA_PATH}...")
    try:
        df = pd.read_csv(DATA_PATH)
    except FileNotFoundError:
        print("Dataset not found! Run scripts/process_all_datasets.py first.")
        return

    # Check for labels
    if 'sentiment_label' not in df.columns:
        print("Data missing 'sentiment_label' column.")
        return

    print(f"Data shape: {df.shape}")
    print(df['sentiment_label'].value_counts())

    # Split
    train_df, val_df = train_test_split(df, test_size=0.1, random_state=42)

    # Tokenizer
    tokenizer = RobertaTokenizer.from_pretrained(MODEL_NAME)

    # Datasets
    train_dataset = SentimentDataset(
        train_df.text.to_numpy(),
        train_df.sentiment_label.to_numpy(),
        tokenizer
    )
    val_dataset = SentimentDataset(
        val_df.text.to_numpy(),
        val_df.sentiment_label.to_numpy(),
        tokenizer
    )

    # Model
    model = RobertaForSequenceClassification.from_pretrained(
        MODEL_NAME, 
        num_labels=3,
        ignore_mismatched_sizes=True
    )

    # Training Args
    training_args = TrainingArguments(
        output_dir=OUTPUT_DIR,
        num_train_epochs=5,
        per_device_train_batch_size=8, # Low batch size for CPU/commodity GPU
        per_device_eval_batch_size=16,
        warmup_steps=500,
        weight_decay=0.01,
        logging_dir='./logs',
        logging_steps=10,
        eval_strategy="steps",
        eval_steps=50,
        save_steps=100,
        load_best_model_at_end=True,
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics
    )

    print("Starting training...")
    trainer.train()
    
    print("Saving model...")
    model.save_pretrained(OUTPUT_DIR + "/final_model")
    tokenizer.save_pretrained(OUTPUT_DIR + "/final_model")
    print("Done!")

if __name__ == "__main__":
    train_sentiment_model()
